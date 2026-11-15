-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 15, 2026 at 12:23 PM
-- Server version: 8.4.3
-- PHP Version: 8.3.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fashionku`
--

-- --------------------------------------------------------

--
-- Table structure for table `addresses`
--

CREATE TABLE `addresses` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `province` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city_or_regency` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `district` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subdistrict` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `postal_code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `notes` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `label` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `recipient_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  `komerce_destination_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_primary` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `addresses`
--

INSERT INTO `addresses` (`id`, `user_id`, `country`, `province`, `city_or_regency`, `district`, `subdistrict`, `postal_code`, `full_address`, `notes`, `label`, `recipient_name`, `phone_number`, `latitude`, `longitude`, `komerce_destination_id`, `is_primary`, `created_at`, `updated_at`) VALUES
(1, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'Indonesia', 'Jawa Barat', 'Bandung', 'Coblong', 'Cipaganti', '40131', 'Jl. Cihampelas No. 120, Bandung', 'Alamat toko Fashionku', 'Toko', 'Fashionku', '081234567890', -6.90342770, 107.61806640, 'KMB-4013', 1, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(2, '17aa9f53-81c1-7db5-a094-14b0cae5d4f2', 'Indonesia', 'DKI Jakarta', 'Jakarta Selatan', 'Kebayoran Baru', 'Gunung', '12160', 'Jl. Panglima Polim V No. 8, Kebayoran Baru', NULL, 'Rumah', 'Sinta Maharani', '081111110001', -6.24450000, 106.79860000, 'KMB-1216', 1, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(3, '581c734e-1148-d4a2-2ba7-f6d32cc31d0f', 'Indonesia', 'Jawa Timur', 'Surabaya', 'Wonokromo', 'Darmo', '60241', 'Jl. Raya Darmo No. 45, Surabaya', NULL, 'Kos', 'Dimas Prayoga', '081111110002', -7.25750000, 112.75210000, 'KMB-6024', 1, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(4, '49be2788-69c8-d175-966e-a15bfc44a012', 'Indonesia', 'Bali', 'Denpasar', 'Denpasar Selatan', 'Sanur', '80228', 'Jl. Danau Tamblingan No. 22, Sanur', NULL, 'Villa', 'Alya Putri', '081111110003', -8.68700000, 115.26200000, 'KMB-8022', 1, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(5, '306cd17b-c0d6-b1b1-cf06-11f5c3ebfabc', 'Indonesia', 'DI Yogyakarta', 'Sleman', 'Depok', 'Caturtunggal', '55281', 'Jl. Kaliurang KM 6, Sleman', NULL, 'Rumah', 'Bagus Wicaksono', '081111110004', -7.74600000, 110.40500000, 'KMB-5528', 1, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(6, '01e1e35a-187c-d961-58ca-25d230056614', 'Indonesia', 'Jawa Barat', 'Bandung', 'Sukajadi', 'Pasteur', '40161', 'Jl. Dr. Setiabudi No. 210, Pasteur, Bandung 40161', NULL, 'Rumah', 'Nadia Kusuma', '08150100004', -5.80000000, 107.20000000, 'KMB-401-005', 1, '2026-07-21 02:24:02', '2026-11-14 02:24:02'),
(7, '97cec183-eea2-5e70-1751-2819621fdbf2', 'Indonesia', 'Jawa Barat', 'Bekasi', 'Bekasi Selatan', 'Jaka Mulya', '17146', 'Jl. Ahmad Yani No. 12, Jaka Mulya, Bekasi 17146', NULL, 'Rumah', 'Rizky Pratama', '08160100005', -5.70000000, 107.30000000, 'KMB-171-006', 1, '2026-07-22 02:24:02', '2026-11-14 02:24:02'),
(8, '32dc5cb6-dfa4-d861-17b7-16128391058c', 'Indonesia', 'Jawa Barat', 'Depok', 'Sukmajaya', 'Mekarsari', '16411', 'Jl. Margonda Raya No. 78, Mekarsari, Depok 16411', 'Titip ke satpam bila tidak ada orang di rumah', 'Rumah', 'Fitri Handayani', '08170100006', -5.60000000, 107.40000000, 'KMB-164-007', 1, '2026-07-23 02:24:02', '2026-11-14 02:24:02'),
(9, 'e770f616-1223-c4da-de7b-e82721d80c40', 'Indonesia', 'Jawa Tengah', 'Semarang', 'Gajahmungkur', 'Bendungan', '50231', 'Jl. Pandanaran No. 34, Bendungan, Semarang 50231', NULL, 'Rumah', 'Arif Setiawan', '08180100007', -5.50000000, 107.50000000, 'KMB-502-008', 1, '2026-07-24 02:24:02', '2026-11-14 02:24:02'),
(10, '20fea1be-a8f1-ea19-daa2-891de5e06685', 'Indonesia', 'Jawa Tengah', 'Surakarta', 'Laweyan', 'Sriwedari', '57141', 'Jl. Slamet Riyadi No. 456, Sriwedari, Surakarta 57141', NULL, 'Rumah', 'Melati Anggraini', '08190100008', -5.40000000, 107.60000000, 'KMB-571-009', 1, '2026-07-25 02:24:02', '2026-11-14 02:24:02'),
(11, 'd741cf38-85e7-6fdc-bfb4-e9f01fa0ac4a', 'Indonesia', 'DI Yogyakarta', 'Sleman', 'Depok', 'Caturtunggal', '55281', 'Jl. Kaliurang KM 6 No. 19, Caturtunggal, Sleman 55281', 'Titip ke satpam bila tidak ada orang di rumah', 'Rumah', 'Yoga Saputra', '08200100009', -5.30000000, 107.70000000, 'KMB-552-010', 1, '2026-07-26 02:24:02', '2026-11-14 02:24:02'),
(12, 'dee09934-26d8-29d8-36e1-1781d5de4a77', 'Indonesia', 'DI Yogyakarta', 'Kota Yogyakarta', 'Gondokusuman', 'Demangan', '55281', 'Jl. Gejayan No. 112, Demangan, Kota Yogyakarta 55281', NULL, 'Rumah', 'Dewi Lestari', '08210100010', -5.20000000, 107.80000000, 'KMB-552-011', 1, '2026-07-27 02:24:02', '2026-11-14 02:24:02'),
(13, 'abe56782-bb24-c759-25f7-e09751e8d336', 'Indonesia', 'Jawa Timur', 'Surabaya', 'Wonokromo', 'Darmo', '60241', 'Jl. Raya Darmo No. 45, Darmo, Surabaya 60241', NULL, 'Rumah', 'Fajar Nugroho', '08220100011', -5.10000000, 107.90000000, 'KMB-602-012', 1, '2026-07-28 02:24:02', '2026-11-14 02:24:02'),
(14, 'd1158e10-1fb5-8d0b-7ab2-b5ad00354462', 'Indonesia', 'Jawa Timur', 'Malang', 'Klojen', 'Klojen', '65112', 'Jl. Basuki Rahmat No. 29, Klojen, Malang 65112', 'Titip ke satpam bila tidak ada orang di rumah', 'Rumah', 'Intan Permata', '08230100012', -5.00000000, 108.00000000, 'KMB-651-013', 1, '2026-07-29 02:24:02', '2026-11-14 02:24:02'),
(15, '03d879fa-ea37-16e7-0382-d9e05bce0ea0', 'Indonesia', 'Jawa Timur', 'Sidoarjo', 'Sidoarjo', 'Pucang Kertu', '61213', 'Jl. Jend. Sudirman No. 88, Pucang Kertu, Sidoarjo 61213', NULL, 'Rumah', 'Reza Fahlevi', '08240100013', -4.90000000, 108.10000000, 'KMB-612-014', 1, '2026-07-30 02:24:02', '2026-11-14 02:24:02'),
(16, 'b4844148-08c8-975a-6f83-f4eddd7fa28a', 'Indonesia', 'Bali', 'Denpasar', 'Denpasar Selatan', 'Sanur', '80228', 'Jl. Danau Tamblingan No. 22, Sanur, Denpasar 80228', NULL, 'Rumah', 'Putri Ayu Lestari', '08250100014', -4.80000000, 108.20000000, 'KMB-802-015', 1, '2026-07-31 02:24:02', '2026-11-14 02:24:02'),
(17, '4937a1c4-62c8-5d35-3433-527614265df0', 'Indonesia', 'Bali', 'Gianyar', 'Ubud', 'Ubud', '80571', 'Jl. Raya Ubud No. 15, Ubud, Gianyar 80571', 'Titip ke satpam bila tidak ada orang di rumah', 'Rumah', 'Hendra Wijaya', '08260100015', -4.70000000, 108.30000000, 'KMB-805-016', 1, '2026-08-01 02:24:02', '2026-11-14 02:24:02'),
(18, '87ee7bc6-865f-4f03-f910-a1d267178717', 'Indonesia', 'Sumatera Utara', 'Medan', 'Medan Baru', 'Sedayu', '20123', 'Jl. Gatot Subroto No. 301, Sedayu, Medan 20123', NULL, 'Rumah', 'Clara Simanjuntak', '08270100016', -4.60000000, 108.40000000, 'KMB-201-017', 1, '2026-08-02 02:24:02', '2026-11-14 02:24:02'),
(19, '3b0b84b6-6ba3-0c40-a16d-a075b449aa0d', 'Indonesia', 'Sumatera Selatan', 'Palembang', 'Ilir Barat I', 'Kemang Manis', '30131', 'Jl. Veteran No. 66, Kemang Manis, Palembang 30131', NULL, 'Rumah', 'Bimo Aditya', '08280100017', -4.50000000, 108.50000000, 'KMB-301-018', 1, '2026-08-03 02:24:02', '2026-11-14 02:24:02'),
(20, 'a83143c9-3367-62a4-1a5c-d250674a1646', 'Indonesia', 'Riau', 'Pekanbaru', 'Sukajadi', 'Harjosari', '28292', 'Jl. Soekarno Hatta No. 141, Harjosari, Pekanbaru 28292', 'Titip ke satpam bila tidak ada orang di rumah', 'Rumah', 'Sari Wulandari', '08290100018', -4.40000000, 108.60000000, 'KMB-282-019', 1, '2026-08-04 02:24:02', '2026-11-14 02:24:02'),
(21, 'dc41400c-122c-90f0-d943-48a55f6f9abd', 'Indonesia', 'Lampung', 'Bandar Lampung', 'Tanjung Karang Pusat', 'Kota Karang', '35116', 'Jl. Wolter Monginsidi No. 73, Kota Karang, Bandar Lampung 35116', NULL, 'Rumah', 'Taufik Hidayat', '08300100019', -4.30000000, 108.70000000, 'KMB-351-020', 1, '2026-08-05 02:24:02', '2026-11-14 02:24:02'),
(22, '83fcef72-cc4f-747a-ee98-7ca1bbda04f9', 'Indonesia', 'Sulawesi Selatan', 'Makassar', 'Panakkukang', 'Karama', '90231', 'Jl. Boulevard No. 18, Karama, Makassar 90231', NULL, 'Rumah', 'Nabila Syakira', '08310100020', -4.20000000, 108.80000000, 'KMB-902-021', 1, '2026-08-06 02:24:02', '2026-11-14 02:24:02'),
(23, 'dd1ecb58-65a6-92bf-dd73-2f17941c977b', 'Indonesia', 'Kalimantan Timur', 'Balikpapan', 'Balikpapan Kota', 'Klandasan Ilir', '76112', 'Jl. MT Haryono No. 55, Klandasan Ilir, Balikpapan 76112', 'Titip ke satpam bila tidak ada orang di rumah', 'Rumah', 'Andi Kurniawan', '08320100021', -4.10000000, 108.90000000, 'KMB-761-022', 1, '2026-08-07 02:24:02', '2026-11-14 02:24:02'),
(24, '266fa5bb-8cc7-149a-46d9-09d1f0c8fe90', 'Indonesia', 'Nusa Tenggara Barat', 'Mataram', 'Mataram', 'Pejanggik', '83117', 'Jl. Pejanggik No. 9, Pejanggik, Mataram 83117', NULL, 'Rumah', 'Ratna Sari', '08330100022', -4.00000000, 109.00000000, 'KMB-831-023', 1, '2026-08-08 02:24:02', '2026-11-14 02:24:02'),
(25, 'ecb48677-ccbf-7d3d-76fd-8944218e0781', 'Indonesia', 'Aceh', 'Banda Aceh', 'Baiturrahman', 'Kupiah', '23352', 'Jl. Tgk. Chik Ditiro No. 61, Kupiah, Banda Aceh 23352', NULL, 'Rumah', 'Ilham Maulana', '08340100023', -3.90000000, 109.10000000, 'KMB-233-024', 1, '2026-08-09 02:24:02', '2026-11-14 02:24:02'),
(26, '8422156d-3226-4379-1db3-86d8a6f18a5e', 'Indonesia', 'DKI Jakarta', 'Jakarta Selatan', 'Kebayoran Baru', 'Gunung', '12160', 'Jl. Panglima Polim V No. 8, Gunung, Jakarta Selatan 12160', 'Titip ke satpam bila tidak ada orang di rumah', 'Rumah', 'Vina Oktaviani', '08350100024', -3.80000000, 109.20000000, 'KMB-121-025', 1, '2026-08-10 02:24:02', '2026-11-14 02:24:02'),
(27, '487eb68d-0b76-e01a-b043-b572294cd606', 'Indonesia', 'DKI Jakarta', 'Jakarta Pusat', 'Menteng', 'Cikini', '10330', 'Jl. Cikini Raya No. 45, Cikini, Jakarta Pusat 10330', NULL, 'Rumah', 'Bayu Firmansyah', '08360100025', -3.70000000, 109.30000000, 'KMB-103-026', 1, '2026-08-11 02:24:02', '2026-11-14 02:24:02'),
(28, 'c9858af3-80a2-1b07-293a-da94c650ac94', 'Indonesia', 'DKI Jakarta', 'Jakarta Barat', 'Grogol Petamburan', 'Tanjung Duren', '11470', 'Jl. Tanjung Duren Utara No. 21, Tanjung Duren, Jakarta Barat 11470', NULL, 'Rumah', 'Citra Kirana', '08370100026', -3.60000000, 109.40000000, 'KMB-114-027', 1, '2026-08-12 02:24:02', '2026-11-14 02:24:02'),
(29, '8f90ee9c-9303-a25d-6d77-f711e7ef84e6', 'Indonesia', 'Jawa Barat', 'Bandung', 'Coblong', 'Cipaganti', '40131', 'Jl. Cipaganti No. 87, Cipaganti, Bandung 40131', 'Titip ke satpam bila tidak ada orang di rumah', 'Rumah', 'Donny Saputra', '08380100027', -3.50000000, 109.50000000, 'KMB-401-028', 1, '2026-08-13 02:24:02', '2026-11-14 02:24:02'),
(30, 'a59b13c6-da0d-cc36-aa08-7fdb038f3e7a', 'Indonesia', 'Jawa Barat', 'Bandung', 'Sukajadi', 'Pasteur', '40161', 'Jl. Dr. Setiabudi No. 210, Pasteur, Bandung 40161', NULL, 'Rumah', 'Eka Puspita', '08390100028', -3.40000000, 109.60000000, 'KMB-401-029', 1, '2026-08-14 02:24:02', '2026-11-14 02:24:02'),
(31, 'accc1906-fb5d-6efc-24ed-0e0fb269c69e', 'Indonesia', 'Jawa Barat', 'Bekasi', 'Bekasi Selatan', 'Jaka Mulya', '17146', 'Jl. Ahmad Yani No. 12, Jaka Mulya, Bekasi 17146', NULL, 'Rumah', 'Gilang Ramadhan', '08400100029', -3.30000000, 109.70000000, 'KMB-171-030', 1, '2026-08-15 02:24:02', '2026-11-14 02:24:02'),
(32, 'cb8dbbb2-6e48-067a-4c9e-e8cfd2d385cb', 'Indonesia', 'Jawa Barat', 'Depok', 'Sukmajaya', 'Mekarsari', '16411', 'Jl. Margonda Raya No. 78, Mekarsari, Depok 16411', 'Titip ke satpam bila tidak ada orang di rumah', 'Rumah', 'Hana Safitri', '08410100030', -3.20000000, 106.80000000, 'KMB-164-031', 1, '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
(33, '8c0d42e6-e169-f777-614c-4c86da4b386d', 'Indonesia', 'Jawa Tengah', 'Semarang', 'Gajahmungkur', 'Bendungan', '50231', 'Jl. Pandanaran No. 34, Bendungan, Semarang 50231', NULL, 'Rumah', 'Irfan Hakim', '08420100031', -3.10000000, 106.90000000, 'KMB-502-032', 1, '2026-08-17 02:24:02', '2026-11-14 02:24:02'),
(34, '05ae4bc5-19bf-91e6-d6d6-f78747261a7f', 'Indonesia', 'Jawa Tengah', 'Surakarta', 'Laweyan', 'Sriwedari', '57141', 'Jl. Slamet Riyadi No. 456, Sriwedari, Surakarta 57141', NULL, 'Rumah', 'Jessica Tanoto', '08430100032', -3.00000000, 107.00000000, 'KMB-571-033', 1, '2026-08-18 02:24:02', '2026-11-14 02:24:02'),
(35, '6523275d-f48d-41a5-0d49-72d139ce2711', 'Indonesia', 'DI Yogyakarta', 'Sleman', 'Depok', 'Caturtunggal', '55281', 'Jl. Kaliurang KM 6 No. 19, Caturtunggal, Sleman 55281', 'Titip ke satpam bila tidak ada orang di rumah', 'Rumah', 'Kevin Santoso', '08440100033', -2.90000000, 107.10000000, 'KMB-552-034', 1, '2026-08-19 02:24:02', '2026-11-14 02:24:02'),
(36, '0dc38b96-2c45-1fef-1143-7c08e97cf3cf', 'Indonesia', 'DI Yogyakarta', 'Kota Yogyakarta', 'Gondokusuman', 'Demangan', '55281', 'Jl. Gejayan No. 112, Demangan, Kota Yogyakarta 55281', NULL, 'Rumah', 'Larasati Dewi', '08450100034', -2.80000000, 107.20000000, 'KMB-552-035', 1, '2026-08-20 02:24:02', '2026-11-14 02:24:02'),
(37, '8769c09a-cfd0-0292-f0c8-30b58bf4f1d5', 'Indonesia', 'Jawa Timur', 'Surabaya', 'Wonokromo', 'Darmo', '60241', 'Jl. Raya Darmo No. 45, Darmo, Surabaya 60241', NULL, 'Rumah', 'Muhammad Rizki', '08460100035', -2.70000000, 107.30000000, 'KMB-602-036', 1, '2026-08-21 02:24:02', '2026-11-14 02:24:02'),
(38, 'fd1a4098-c0e9-2f33-f52d-b2b92cef814c', 'Indonesia', 'Jawa Timur', 'Malang', 'Klojen', 'Klojen', '65112', 'Jl. Basuki Rahmat No. 29, Klojen, Malang 65112', 'Titip ke satpam bila tidak ada orang di rumah', 'Rumah', 'Nina Marlina', '08470100036', -2.60000000, 107.40000000, 'KMB-651-037', 1, '2026-08-22 02:24:02', '2026-11-14 02:24:02'),
(39, 'e237eb66-fa74-3577-7aed-437a8db49b60', 'Indonesia', 'Jawa Timur', 'Sidoarjo', 'Sidoarjo', 'Pucang Kertu', '61213', 'Jl. Jend. Sudirman No. 88, Pucang Kertu, Sidoarjo 61213', NULL, 'Rumah', 'Oscar Simbolon', '08480100037', -2.50000000, 107.50000000, 'KMB-612-038', 1, '2026-08-23 02:24:02', '2026-11-14 02:24:02'),
(40, '028f8278-dfa1-4d9d-a2fb-eddd26813921', 'Indonesia', 'Bali', 'Denpasar', 'Denpasar Selatan', 'Sanur', '80228', 'Jl. Danau Tamblingan No. 22, Sanur, Denpasar 80228', NULL, 'Rumah', 'Prasetyo Adi', '08490100038', -2.40000000, 107.60000000, 'KMB-802-039', 1, '2026-08-24 02:24:02', '2026-11-14 02:24:02'),
(41, '6fbb8c86-9231-b8a1-88d3-646663652350', 'Indonesia', 'Bali', 'Gianyar', 'Ubud', 'Ubud', '80571', 'Jl. Raya Ubud No. 15, Ubud, Gianyar 80571', 'Titip ke satpam bila tidak ada orang di rumah', 'Rumah', 'Qonita Rahma', '08500100039', -2.30000000, 107.70000000, 'KMB-805-040', 1, '2026-08-25 02:24:02', '2026-11-14 02:24:02'),
(42, '0112d875-50e7-9f82-e3db-8b236203ae0c', 'Indonesia', 'Sumatera Utara', 'Medan', 'Medan Baru', 'Sedayu', '20123', 'Jl. Gatot Subroto No. 301, Sedayu, Medan 20123', NULL, 'Rumah', 'Rangga Pratama', '08510100040', -6.20000000, 107.80000000, 'KMB-201-041', 1, '2026-08-26 02:24:02', '2026-11-14 02:24:02'),
(43, 'adae9f8e-378d-b2a2-3122-70eb31a99996', 'Indonesia', 'Sumatera Selatan', 'Palembang', 'Ilir Barat I', 'Kemang Manis', '30131', 'Jl. Veteran No. 66, Kemang Manis, Palembang 30131', NULL, 'Rumah', 'Sylvia Handoko', '08520100041', -6.10000000, 107.90000000, 'KMB-301-042', 1, '2026-08-27 02:24:02', '2026-11-14 02:24:02'),
(44, '4920f24e-514f-e2cd-08c0-3adf50220e53', 'Indonesia', 'Riau', 'Pekanbaru', 'Sukajadi', 'Harjosari', '28292', 'Jl. Soekarno Hatta No. 141, Harjosari, Pekanbaru 28292', 'Titip ke satpam bila tidak ada orang di rumah', 'Rumah', 'Tegar Afandi', '08530100042', -6.00000000, 108.00000000, 'KMB-282-043', 1, '2026-08-28 02:24:02', '2026-11-14 02:24:02'),
(45, 'eb50c71c-58bf-77e2-f3b9-920c25108c95', 'Indonesia', 'Lampung', 'Bandar Lampung', 'Tanjung Karang Pusat', 'Kota Karang', '35116', 'Jl. Wolter Monginsidi No. 73, Kota Karang, Bandar Lampung 35116', NULL, 'Rumah', 'Ulfa Nurlaila', '08540100043', -5.90000000, 108.10000000, 'KMB-351-044', 1, '2026-08-29 02:24:02', '2026-11-14 02:24:02'),
(46, '2c230d3d-c8f6-ebf9-80d8-9238d4f2941a', 'Indonesia', 'Sulawesi Selatan', 'Makassar', 'Panakkukang', 'Karama', '90231', 'Jl. Boulevard No. 18, Karama, Makassar 90231', NULL, 'Rumah', 'Vino Bastian', '08550100044', -5.80000000, 108.20000000, 'KMB-902-045', 1, '2026-08-30 02:24:02', '2026-11-14 02:24:02'),
(47, '4a41bf20-08d0-3256-2da1-473d2df9332d', 'Indonesia', 'Kalimantan Timur', 'Balikpapan', 'Balikpapan Kota', 'Klandasan Ilir', '76112', 'Jl. MT Haryono No. 55, Klandasan Ilir, Balikpapan 76112', 'Titip ke satpam bila tidak ada orang di rumah', 'Rumah', 'Wulan Sari', '08560100045', -5.70000000, 108.30000000, 'KMB-761-046', 1, '2026-08-31 02:24:02', '2026-11-14 02:24:02'),
(48, '53c58789-9a09-c2a9-e0cd-c840a7530ddb', 'Indonesia', 'Nusa Tenggara Barat', 'Mataram', 'Mataram', 'Pejanggik', '83117', 'Jl. Pejanggik No. 9, Pejanggik, Mataram 83117', NULL, 'Rumah', 'Yoga Pranata', '08570100046', -5.60000000, 108.40000000, 'KMB-831-047', 1, '2026-09-01 02:24:02', '2026-11-14 02:24:02'),
(49, '3321e0dd-e12f-8a1a-db98-d2bc759a8436', 'Indonesia', 'Aceh', 'Banda Aceh', 'Baiturrahman', 'Kupiah', '23352', 'Jl. Tgk. Chik Ditiro No. 61, Kupiah, Banda Aceh 23352', NULL, 'Rumah', 'Zahra Amelia', '08580100047', -5.50000000, 108.50000000, 'KMB-233-048', 1, '2026-09-02 02:24:02', '2026-11-14 02:24:02'),
(50, 'c323571d-d64c-f97c-2808-140d3610f2eb', 'Indonesia', 'DKI Jakarta', 'Jakarta Selatan', 'Kebayoran Baru', 'Gunung', '12160', 'Jl. Panglima Polim V No. 8, Gunung, Jakarta Selatan 12160', 'Titip ke satpam bila tidak ada orang di rumah', 'Rumah', 'Aditya Nugraha', '08590100048', -5.40000000, 108.60000000, 'KMB-121-049', 1, '2026-09-03 02:24:02', '2026-11-14 02:24:02'),
(51, 'fb358165-f121-342b-620b-53a635217b97', 'Indonesia', 'DKI Jakarta', 'Jakarta Pusat', 'Menteng', 'Cikini', '10330', 'Jl. Cikini Raya No. 45, Cikini, Jakarta Pusat 10330', NULL, 'Rumah', 'Bella Anindita', '08600100049', -5.30000000, 108.70000000, 'KMB-103-050', 1, '2026-09-04 02:24:02', '2026-11-14 02:24:02'),
(52, 'ab398d16-9f7d-2929-aa2b-13f81d78d085', 'Indonesia', 'DKI Jakarta', 'Jakarta Barat', 'Grogol Petamburan', 'Tanjung Duren', '11470', 'Jl. Tanjung Duren Utara No. 21, Tanjung Duren, Jakarta Barat 11470', NULL, 'Rumah', 'Chandra Wijaya', '08610100050', -5.20000000, 108.80000000, 'KMB-114-051', 1, '2026-09-05 02:24:02', '2026-11-14 02:24:02'),
(53, 'ddc8ad23-f5d1-dbc4-0919-7a0eb049e67c', 'Indonesia', 'Jawa Barat', 'Bandung', 'Coblong', 'Cipaganti', '40131', 'Jl. Cipaganti No. 87, Cipaganti, Bandung 40131', 'Titip ke satpam bila tidak ada orang di rumah', 'Rumah', 'Dinda Larasati', '08620100051', -5.10000000, 108.90000000, 'KMB-401-052', 1, '2026-09-06 02:24:02', '2026-11-14 02:24:02'),
(54, '2f5b0694-e364-f9bd-e445-034953d50131', 'Indonesia', 'Jawa Barat', 'Bandung', 'Sukajadi', 'Pasteur', '40161', 'Jl. Dr. Setiabudi No. 210, Pasteur, Bandung 40161', NULL, 'Rumah', 'Eko Purnomo', '08630100052', -5.00000000, 109.00000000, 'KMB-401-053', 1, '2026-09-07 02:24:02', '2026-11-14 02:24:02'),
(55, 'c867f90f-7824-10fe-2aa3-2359ffe920a3', 'Indonesia', 'Jawa Barat', 'Bekasi', 'Bekasi Selatan', 'Jaka Mulya', '17146', 'Jl. Ahmad Yani No. 12, Jaka Mulya, Bekasi 17146', NULL, 'Rumah', 'Farah Nabila', '08640100053', -4.90000000, 109.10000000, 'KMB-171-054', 1, '2026-09-08 02:24:02', '2026-11-14 02:24:02'),
(56, 'bf03fbce-d1d2-7300-136d-f61e4acdbe91', 'Indonesia', 'Jawa Barat', 'Depok', 'Sukmajaya', 'Mekarsari', '16411', 'Jl. Margonda Raya No. 78, Mekarsari, Depok 16411', 'Titip ke satpam bila tidak ada orang di rumah', 'Rumah', 'Galih Prakoso', '08650100054', -4.80000000, 109.20000000, 'KMB-164-055', 1, '2026-09-09 02:24:02', '2026-11-14 02:24:02'),
(57, '7bdd6f0a-3f48-e6e8-ee16-ec8e84ff19ca', 'Indonesia', 'Jawa Tengah', 'Semarang', 'Gajahmungkur', 'Bendungan', '50231', 'Jl. Pandanaran No. 34, Bendungan, Semarang 50231', NULL, 'Rumah', 'Hesti Puspitasari', '08660100055', -4.70000000, 109.30000000, 'KMB-502-056', 1, '2026-09-10 02:24:02', '2026-11-14 02:24:02'),
(58, '0fa38f39-7c4b-b50a-4de5-5843c793c295', 'Indonesia', 'Jawa Tengah', 'Surakarta', 'Laweyan', 'Sriwedari', '57141', 'Jl. Slamet Riyadi No. 456, Sriwedari, Surakarta 57141', NULL, 'Rumah', 'Indra Kusuma', '08670100056', -4.60000000, 109.40000000, 'KMB-571-057', 1, '2026-09-11 02:24:02', '2026-11-14 02:24:02'),
(59, '8234251c-184e-4d14-e02b-63b6b5869842', 'Indonesia', 'DI Yogyakarta', 'Sleman', 'Depok', 'Caturtunggal', '55281', 'Jl. Kaliurang KM 6 No. 19, Caturtunggal, Sleman 55281', 'Titip ke satpam bila tidak ada orang di rumah', 'Rumah', 'Jihan Aurelia', '08680100057', -4.50000000, 109.50000000, 'KMB-552-058', 1, '2026-09-12 02:24:02', '2026-11-14 02:24:02'),
(60, '3509673a-1d35-b0b9-594c-ff9f3e19b2a9', 'Indonesia', 'DI Yogyakarta', 'Kota Yogyakarta', 'Gondokusuman', 'Demangan', '55281', 'Jl. Gejayan No. 112, Demangan, Kota Yogyakarta 55281', NULL, 'Rumah', 'Krisna Yudha', '08690100058', -4.40000000, 109.60000000, 'KMB-552-059', 1, '2026-09-13 02:24:02', '2026-11-14 02:24:02'),
(61, '76fe5857-9fc0-e31b-449f-0ec9892d2459', 'Indonesia', 'Jawa Timur', 'Surabaya', 'Wonokromo', 'Darmo', '60241', 'Jl. Raya Darmo No. 45, Darmo, Surabaya 60241', NULL, 'Rumah', 'Lestari Ningsih', '08700100059', -4.30000000, 109.70000000, 'KMB-602-060', 1, '2026-09-14 02:24:02', '2026-11-14 02:24:02'),
(62, 'fb22fb2e-476d-d51c-8f73-08aa30e70f4b', 'Indonesia', 'Jawa Timur', 'Malang', 'Klojen', 'Klojen', '65112', 'Jl. Basuki Rahmat No. 29, Klojen, Malang 65112', 'Titip ke satpam bila tidak ada orang di rumah', 'Rumah', 'Miko Alfandi', '08710100060', -4.20000000, 106.80000000, 'KMB-651-061', 1, '2026-09-15 02:24:02', '2026-11-14 02:24:02'),
(63, 'd6279585-7e9d-a7d9-50b8-d20071ff20d5', 'Indonesia', 'Jawa Timur', 'Sidoarjo', 'Sidoarjo', 'Pucang Kertu', '61213', 'Jl. Jend. Sudirman No. 88, Pucang Kertu, Sidoarjo 61213', NULL, 'Rumah', 'Nadya Salsabila', '08720100061', -4.10000000, 106.90000000, 'KMB-612-062', 1, '2026-09-16 02:24:02', '2026-11-14 02:24:02'),
(64, '38a478fc-af46-dab9-a7f9-ebe250220e5c', 'Indonesia', 'Bali', 'Denpasar', 'Denpasar Selatan', 'Sanur', '80228', 'Jl. Danau Tamblingan No. 22, Sanur, Denpasar 80228', NULL, 'Rumah', 'Oki Setiabudi', '08730100062', -4.00000000, 107.00000000, 'KMB-802-063', 1, '2026-09-17 02:24:02', '2026-11-14 02:24:02'),
(65, '37fcb800-49bf-9dbf-c867-fc9d233699c1', 'Indonesia', 'Bali', 'Gianyar', 'Ubud', 'Ubud', '80571', 'Jl. Raya Ubud No. 15, Ubud, Gianyar 80571', 'Titip ke satpam bila tidak ada orang di rumah', 'Rumah', 'Putra Mahendra', '08740100063', -3.90000000, 107.10000000, 'KMB-805-064', 1, '2026-09-18 02:24:02', '2026-11-14 02:24:02'),
(66, '4fe4a5a9-ca82-3950-aa71-8f06a919f0bf', 'Indonesia', 'Sumatera Utara', 'Medan', 'Medan Baru', 'Sedayu', '20123', 'Jl. Gatot Subroto No. 301, Sedayu, Medan 20123', NULL, 'Rumah', 'Qori Amalia', '08750100064', -3.80000000, 107.20000000, 'KMB-201-065', 1, '2026-09-19 02:24:02', '2026-11-14 02:24:02'),
(67, 'b430a205-e6c4-f1a2-dd01-89b5c8728d3f', 'Indonesia', 'Sumatera Selatan', 'Palembang', 'Ilir Barat I', 'Kemang Manis', '30131', 'Jl. Veteran No. 66, Kemang Manis, Palembang 30131', NULL, 'Rumah', 'Rian Adinata', '08760100065', -3.70000000, 107.30000000, 'KMB-301-066', 1, '2026-09-20 02:24:02', '2026-11-14 02:24:02'),
(68, '74e3c558-0560-b63b-ba00-8a01fc6af72a', 'Indonesia', 'Riau', 'Pekanbaru', 'Sukajadi', 'Harjosari', '28292', 'Jl. Soekarno Hatta No. 141, Harjosari, Pekanbaru 28292', 'Titip ke satpam bila tidak ada orang di rumah', 'Rumah', 'Sinta Dewanti', '08770100066', -3.60000000, 107.40000000, 'KMB-282-067', 1, '2026-09-21 02:24:02', '2026-11-14 02:24:02'),
(69, '5e73f21e-65ff-583e-b0b2-49790262bd99', 'Indonesia', 'Lampung', 'Bandar Lampung', 'Tanjung Karang Pusat', 'Kota Karang', '35116', 'Jl. Wolter Monginsidi No. 73, Kota Karang, Bandar Lampung 35116', NULL, 'Rumah', 'Tomi Gunawan', '08780100067', -3.50000000, 107.50000000, 'KMB-351-068', 1, '2026-09-22 02:24:02', '2026-11-14 02:24:02'),
(70, '1b27d6c4-11e9-13d0-67d2-810e998376cc', 'Indonesia', 'Sulawesi Selatan', 'Makassar', 'Panakkukang', 'Karama', '90231', 'Jl. Boulevard No. 18, Karama, Makassar 90231', NULL, 'Rumah', 'Umi Kalsum', '08790100068', -3.40000000, 107.60000000, 'KMB-902-069', 1, '2026-09-23 02:24:02', '2026-11-14 02:24:02'),
(71, '62846adc-59a0-1459-ca7b-6d67b7cb98bb', 'Indonesia', 'Kalimantan Timur', 'Balikpapan', 'Balikpapan Kota', 'Klandasan Ilir', '76112', 'Jl. MT Haryono No. 55, Klandasan Ilir, Balikpapan 76112', 'Titip ke satpam bila tidak ada orang di rumah', 'Rumah', 'Verdiansyah Putra', '08800100069', -3.30000000, 107.70000000, 'KMB-761-070', 1, '2026-09-24 02:24:02', '2026-11-14 02:24:02'),
(72, '777afe4c-4837-d716-a13c-846e9cd8cd7a', 'Indonesia', 'Nusa Tenggara Barat', 'Mataram', 'Mataram', 'Pejanggik', '83117', 'Jl. Pejanggik No. 9, Pejanggik, Mataram 83117', NULL, 'Rumah', 'Winda Kartika', '08810100070', -3.20000000, 107.80000000, 'KMB-831-071', 1, '2026-09-25 02:24:02', '2026-11-14 02:24:02'),
(73, '68cea60f-963e-3cf9-2f5d-579d2cffe41b', 'Indonesia', 'Aceh', 'Banda Aceh', 'Baiturrahman', 'Kupiah', '23352', 'Jl. Tgk. Chik Ditiro No. 61, Kupiah, Banda Aceh 23352', NULL, 'Rumah', 'Yusril Hakim', '08820100071', -3.10000000, 107.90000000, 'KMB-233-072', 1, '2026-09-26 02:24:02', '2026-11-14 02:24:02'),
(74, '331429a9-ba63-a268-3e5d-49912a26b5df', 'Indonesia', 'DKI Jakarta', 'Jakarta Selatan', 'Kebayoran Baru', 'Gunung', '12160', 'Jl. Panglima Polim V No. 8, Gunung, Jakarta Selatan 12160', 'Titip ke satpam bila tidak ada orang di rumah', 'Rumah', 'Zaskia Mecca', '08830100072', -3.00000000, 108.00000000, 'KMB-121-073', 1, '2026-09-27 02:24:02', '2026-11-14 02:24:02'),
(75, '5570cce1-49a1-d137-3658-ff2640f2c112', 'Indonesia', 'DKI Jakarta', 'Jakarta Pusat', 'Menteng', 'Cikini', '10330', 'Jl. Cikini Raya No. 45, Cikini, Jakarta Pusat 10330', NULL, 'Rumah', 'Ahmad Fauzi', '08840100073', -2.90000000, 108.10000000, 'KMB-103-074', 1, '2026-09-28 02:24:02', '2026-11-14 02:24:02'),
(76, 'cf1106a3-b582-6454-caed-c4b9d720bdcd', 'Indonesia', 'DKI Jakarta', 'Jakarta Barat', 'Grogol Petamburan', 'Tanjung Duren', '11470', 'Jl. Tanjung Duren Utara No. 21, Tanjung Duren, Jakarta Barat 11470', NULL, 'Rumah', 'Brigita Sitorus', '08850100074', -2.80000000, 108.20000000, 'KMB-114-075', 1, '2026-09-29 02:24:02', '2026-11-14 02:24:02'),
(77, '36333497-c72b-06cc-4875-815d9af60356', 'Indonesia', 'Jawa Barat', 'Bandung', 'Coblong', 'Cipaganti', '40131', 'Jl. Cipaganti No. 87, Cipaganti, Bandung 40131', 'Titip ke satpam bila tidak ada orang di rumah', 'Rumah', 'Cahyo Nugroho', '08860100075', -2.70000000, 108.30000000, 'KMB-401-076', 1, '2026-09-30 02:24:02', '2026-11-14 02:24:02'),
(78, 'c0d89002-20de-8855-3335-a6eb7ec4038f', 'Indonesia', 'Jawa Barat', 'Bandung', 'Sukajadi', 'Pasteur', '40161', 'Jl. Dr. Setiabudi No. 210, Pasteur, Bandung 40161', NULL, 'Rumah', 'Dian Purnamasari', '08870100076', -2.60000000, 108.40000000, 'KMB-401-077', 1, '2026-10-01 02:24:02', '2026-11-14 02:24:02'),
(79, '83981746-29d9-2a4e-4c3d-45ae19bcb789', 'Indonesia', 'Jawa Barat', 'Bekasi', 'Bekasi Selatan', 'Jaka Mulya', '17146', 'Jl. Ahmad Yani No. 12, Jaka Mulya, Bekasi 17146', NULL, 'Rumah', 'Erlangga Putra', '08880100077', -2.50000000, 108.50000000, 'KMB-171-078', 1, '2026-10-02 02:24:02', '2026-11-14 02:24:02'),
(80, '20d503c5-6e99-eb51-0cbd-2725f7e2e876', 'Indonesia', 'Jawa Barat', 'Depok', 'Sukmajaya', 'Mekarsari', '16411', 'Jl. Margonda Raya No. 78, Mekarsari, Depok 16411', 'Titip ke satpam bila tidak ada orang di rumah', 'Rumah', 'Fransiska Loi', '08890100078', -2.40000000, 108.60000000, 'KMB-164-079', 1, '2026-10-03 02:24:02', '2026-11-14 02:24:02'),
(81, 'be1f7f6c-786f-886f-70fd-1adf76c06110', 'Indonesia', 'Jawa Tengah', 'Semarang', 'Gajahmungkur', 'Bendungan', '50231', 'Jl. Pandanaran No. 34, Bendungan, Semarang 50231', NULL, 'Rumah', 'Gading Martadinata', '08900100079', -2.30000000, 108.70000000, 'KMB-502-080', 1, '2026-10-04 02:24:02', '2026-11-14 02:24:02'),
(82, 'b1bd0bd7-5142-a51a-9155-576acb2bc84e', 'Indonesia', 'Jawa Tengah', 'Surakarta', 'Laweyan', 'Sriwedari', '57141', 'Jl. Slamet Riyadi No. 456, Sriwedari, Surakarta 57141', NULL, 'Rumah', 'Hilda Yuliani', '08910100080', -6.20000000, 108.80000000, 'KMB-571-081', 1, '2026-10-05 02:24:02', '2026-11-14 02:24:02'),
(83, '74266d05-6397-1296-991e-3d76c6ad9122', 'Indonesia', 'DI Yogyakarta', 'Sleman', 'Depok', 'Caturtunggal', '55281', 'Jl. Kaliurang KM 6 No. 19, Caturtunggal, Sleman 55281', 'Titip ke satpam bila tidak ada orang di rumah', 'Rumah', 'Iqbal Mauludi', '08920100081', -6.10000000, 108.90000000, 'KMB-552-082', 1, '2026-10-06 02:24:02', '2026-11-14 02:24:02'),
(84, 'a61ecb87-2715-a57d-a602-f41571558b3e', 'Indonesia', 'DI Yogyakarta', 'Kota Yogyakarta', 'Gondokusuman', 'Demangan', '55281', 'Jl. Gejayan No. 112, Demangan, Kota Yogyakarta 55281', NULL, 'Rumah', 'Juwita Sari', '08930100082', -6.00000000, 109.00000000, 'KMB-552-083', 1, '2026-10-07 02:24:02', '2026-11-14 02:24:02'),
(85, '865931e8-2cc7-befe-d1a4-40f2184e8564', 'Indonesia', 'Jawa Timur', 'Surabaya', 'Wonokromo', 'Darmo', '60241', 'Jl. Raya Darmo No. 45, Darmo, Surabaya 60241', NULL, 'Rumah', 'Kemal Ataturk', '08940100083', -5.90000000, 109.10000000, 'KMB-602-084', 1, '2026-10-08 02:24:02', '2026-11-14 02:24:02'),
(86, '3221a57c-2610-e0e3-593c-6b7c8f444086', 'Indonesia', 'Jawa Timur', 'Malang', 'Klojen', 'Klojen', '65112', 'Jl. Basuki Rahmat No. 29, Klojen, Malang 65112', 'Titip ke satpam bila tidak ada orang di rumah', 'Rumah', 'Lidya Manurung', '08950100084', -5.80000000, 109.20000000, 'KMB-651-085', 1, '2026-10-09 02:24:02', '2026-11-14 02:24:02'),
(87, '89a52d76-3cfc-c24c-cb98-21a4a56adbda', 'Indonesia', 'Jawa Timur', 'Sidoarjo', 'Sidoarjo', 'Pucang Kertu', '61213', 'Jl. Jend. Sudirman No. 88, Pucang Kertu, Sidoarjo 61213', NULL, 'Rumah', 'Maulana Yusuf', '08960100085', -5.70000000, 109.30000000, 'KMB-612-086', 1, '2026-10-10 02:24:02', '2026-11-14 02:24:02'),
(88, 'c5d9f141-2619-5ce4-055c-a13b1b030640', 'Indonesia', 'Bali', 'Denpasar', 'Denpasar Selatan', 'Sanur', '80228', 'Jl. Danau Tamblingan No. 22, Sanur, Denpasar 80228', NULL, 'Rumah', 'Novi Andriani', '08970100086', -5.60000000, 109.40000000, 'KMB-802-087', 1, '2026-10-11 02:24:02', '2026-11-14 02:24:02'),
(89, 'dcaf3e0f-c3e0-3dd6-e158-cca1ec2560ad', 'Indonesia', 'Bali', 'Gianyar', 'Ubud', 'Ubud', '80571', 'Jl. Raya Ubud No. 15, Ubud, Gianyar 80571', 'Titip ke satpam bila tidak ada orang di rumah', 'Rumah', 'Opan Sofyan', '08980100087', -5.50000000, 109.50000000, 'KMB-805-088', 1, '2026-10-12 02:24:02', '2026-11-14 02:24:02'),
(90, 'dff1ab85-91bd-f4a1-f36c-a62f6c2ce82e', 'Indonesia', 'Sumatera Utara', 'Medan', 'Medan Baru', 'Sedayu', '20123', 'Jl. Gatot Subroto No. 301, Sedayu, Medan 20123', NULL, 'Rumah', 'Puspita Ayu', '08990100088', -5.40000000, 109.60000000, 'KMB-201-089', 1, '2026-10-13 02:24:02', '2026-11-14 02:24:02'),
(91, '568ac464-063b-302b-c6f0-9a384b93f540', 'Indonesia', 'Sumatera Selatan', 'Palembang', 'Ilir Barat I', 'Kemang Manis', '30131', 'Jl. Veteran No. 66, Kemang Manis, Palembang 30131', NULL, 'Rumah', 'Qodratullah Hasan', '08110100089', -5.30000000, 109.70000000, 'KMB-301-090', 1, '2026-10-14 02:24:02', '2026-11-14 02:24:02'),
(92, '3dbd1354-8f7a-40b0-6247-23fcd4c8f491', 'Indonesia', 'Riau', 'Pekanbaru', 'Sukajadi', 'Harjosari', '28292', 'Jl. Soekarno Hatta No. 141, Harjosari, Pekanbaru 28292', 'Titip ke satpam bila tidak ada orang di rumah', 'Rumah', 'Rahmat Hidayat', '08120100090', -5.20000000, 106.80000000, 'KMB-282-091', 1, '2026-10-15 02:24:02', '2026-11-14 02:24:02'),
(93, '1e269f2c-8386-1ef0-ff8e-1494bf3746a3', 'Indonesia', 'Lampung', 'Bandar Lampung', 'Tanjung Karang Pusat', 'Kota Karang', '35116', 'Jl. Wolter Monginsidi No. 73, Kota Karang, Bandar Lampung 35116', NULL, 'Rumah', 'Suhailah Rahman', '08130100091', -5.10000000, 106.90000000, 'KMB-351-092', 1, '2026-10-16 02:24:02', '2026-11-14 02:24:02'),
(94, 'e61c80b0-3705-187e-58b5-70d1edb6ed8f', 'Indonesia', 'Sulawesi Selatan', 'Makassar', 'Panakkukang', 'Karama', '90231', 'Jl. Boulevard No. 18, Karama, Makassar 90231', NULL, 'Rumah', 'Teguh Santoso', '08140100092', -5.00000000, 107.00000000, 'KMB-902-093', 1, '2026-10-17 02:24:02', '2026-11-14 02:24:02'),
(95, '847439d3-e0dd-ae2f-0ee8-9a07860386bd', 'Indonesia', 'Kalimantan Timur', 'Balikpapan', 'Balikpapan Kota', 'Klandasan Ilir', '76112', 'Jl. MT Haryono No. 55, Klandasan Ilir, Balikpapan 76112', 'Titip ke satpam bila tidak ada orang di rumah', 'Rumah', 'Ujang Suryana', '08150100093', -4.90000000, 107.10000000, 'KMB-761-094', 1, '2026-10-18 02:24:02', '2026-11-14 02:24:02'),
(96, 'dcf53c7b-7960-20e7-e37b-ce04efcd9d31', 'Indonesia', 'Nusa Tenggara Barat', 'Mataram', 'Mataram', 'Pejanggik', '83117', 'Jl. Pejanggik No. 9, Pejanggik, Mataram 83117', NULL, 'Rumah', 'Vera Marlina', '08160100094', -4.80000000, 107.20000000, 'KMB-831-095', 1, '2026-10-19 02:24:02', '2026-11-14 02:24:02'),
(97, '4999ee98-9d2f-16b5-4e45-782a5cbc2e18', 'Indonesia', 'Aceh', 'Banda Aceh', 'Baiturrahman', 'Kupiah', '23352', 'Jl. Tgk. Chik Ditiro No. 61, Kupiah, Banda Aceh 23352', NULL, 'Rumah', 'Wahyu Setiawan', '08170100095', -4.70000000, 107.30000000, 'KMB-233-096', 1, '2026-10-20 02:24:02', '2026-11-14 02:24:02');

-- --------------------------------------------------------

--
-- Table structure for table `admin_notifications`
--

CREATE TABLE `admin_notifications` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `actor_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `module` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `reference_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reference_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta` json DEFAULT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admin_notifications`
--

INSERT INTO `admin_notifications` (`id`, `user_id`, `actor_id`, `module`, `type`, `title`, `message`, `reference_type`, `reference_id`, `url`, `meta`, `read_at`, `is_active`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'c9858af3-80a2-1b07-293a-da94c650ac94', 'orders', 'order.cancelled', 'Pesanan dibatalkan', 'FKU-20261114-9003 · Stok ukuran tidak tersedia', 'order', '4', '/admin/orders?order=4', '{\"order_number\": \"FKU-20261114-9003\"}', NULL, 1, '2026-11-14 02:11:02', '2026-11-14 02:11:02', NULL),
(2, 'ea469813-e902-00b9-1bf4-a15e254ce82d', '568ac464-063b-302b-c6f0-9a384b93f540', 'orders', 'order.cancelled', 'Pesanan dibatalkan', 'FKU-20261109-9054 · Pembeli membatalkan sebelum dikirim', 'order', '55', '/admin/orders?order=55', '{\"order_number\": \"FKU-20261109-9054\"}', NULL, 1, '2026-11-10 23:29:02', '2026-11-10 23:29:02', NULL),
(3, 'ea469813-e902-00b9-1bf4-a15e254ce82d', '05ae4bc5-19bf-91e6-d6d6-f78747261a7f', 'orders', 'order.cancelled', 'Pesanan dibatalkan', 'FKU-20261103-9081 · Stok ukuran tidak tersedia', 'order', '82', '/admin/orders?order=82', '{\"order_number\": \"FKU-20261103-9081\"}', NULL, 1, '2026-11-06 15:13:02', '2026-11-06 15:13:02', NULL),
(4, 'ea469813-e902-00b9-1bf4-a15e254ce82d', '68cea60f-963e-3cf9-2f5d-579d2cffe41b', 'orders', 'order.cancelled', 'Pesanan dibatalkan', 'FKU-20261004-9108 · Pembeli membatalkan sebelum dikirim', 'order', '109', '/admin/orders?order=109', '{\"order_number\": \"FKU-20261004-9108\"}', NULL, 1, '2026-10-16 06:31:02', '2026-10-16 06:31:02', NULL),
(5, 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, 'orders', 'order.created', 'Pesanan baru masuk', 'FKU-20261114-9000 · Rp 196.000', 'order', '1', '/admin/orders?order=1', '{\"status\": \"pending\", \"order_number\": \"FKU-20261114-9000\"}', NULL, 1, '2026-11-14 02:19:37', '2026-11-14 02:19:37', NULL),
(6, 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, 'orders', 'order.created', 'Pesanan baru', 'FKU-20261114-9001 · Rp 338.000', 'order', '2', '/admin/orders?order=2', '{\"status\": \"pending\", \"order_number\": \"FKU-20261114-9001\"}', NULL, 1, '2026-11-14 01:56:37', '2026-11-14 01:56:37', NULL),
(7, 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, 'orders', 'order.created', 'Pesanan baru', 'FKU-20261114-9002 · Rp 1.386.000', 'order', '3', '/admin/orders?order=3', '{\"status\": \"pending\", \"order_number\": \"FKU-20261114-9002\"}', '2026-11-14 01:54:37', 1, '2026-11-14 01:33:37', '2026-11-14 01:33:37', NULL),
(8, 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, 'orders', 'order.created', 'Pesanan baru', 'FKU-20261114-9003 · Rp 378.000', 'order', '4', '/admin/orders?order=4', '{\"status\": \"cancelled\", \"order_number\": \"FKU-20261114-9003\"}', '2026-11-14 01:54:37', 1, '2026-11-14 01:10:37', '2026-11-14 01:10:37', NULL),
(9, 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, 'support', 'support.ticket.created', 'Help baru: TKT-20261114-0001', 'QRIS sudah terpotong tapi pesanan belum masuk', 'support_ticket', '1', '/admin/help?ticket=1', '{\"priority\": \"urgent\"}', NULL, 1, '2026-11-14 02:04:37', '2026-11-14 02:04:37', NULL),
(10, 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, 'support', 'support.ticket.created', 'Help baru: TKT-20261114-0002', 'Pesanan belum bergerak dari status diproses', 'support_ticket', '2', '/admin/help?ticket=2', '{\"priority\": \"high\"}', '2026-11-14 00:54:37', 1, '2026-11-14 01:09:37', '2026-11-14 01:09:37', NULL),
(11, 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, 'support', 'support.ticket.created', 'Help baru: TKT-20261114-0003', 'Ukuran kemeja linen oversize untuk tinggi 168 cm', 'support_ticket', '3', '/admin/help?ticket=3', '{\"priority\": \"normal\"}', '2026-11-14 00:54:37', 1, '2026-11-14 00:14:37', '2026-11-14 00:14:37', NULL),
(12, 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, 'inventory', 'stock.low', 'Stok menipis', 'Kaos Undershirt Viscose Putih (M) tersisa 0 pcs · SKU FKU-KAOS10-M', 'product_variant', '35', '/admin/products/35/stock', '{\"sku\": \"FKU-KAOS10-M\", \"stock\": 0}', NULL, 1, '2026-11-14 01:39:37', '2026-11-14 01:39:37', NULL),
(13, 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, 'inventory', 'stock.low', 'Stok menipis', 'Jaket Bomber Ripstop Hitam (M) tersisa 0 pcs · SKU FKU-JAKE21-M', 'product_variant', '74', '/admin/products/74/stock', '{\"sku\": \"FKU-JAKE21-M\", \"stock\": 0}', '2026-11-14 00:24:37', 1, '2026-11-14 01:24:37', '2026-11-14 01:24:37', NULL),
(14, 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, 'inventory', 'stock.low', 'Stok menipis', 'Jaket Denim Oversize Blue Washed (S) tersisa 1 pcs · SKU FKU-JAKE19-S', 'product_variant', '66', '/admin/products/66/stock', '{\"sku\": \"FKU-JAKE19-S\", \"stock\": 1}', '2026-11-14 00:24:37', 1, '2026-11-14 01:09:37', '2026-11-14 01:09:37', NULL),
(15, 'ea469813-e902-00b9-1bf4-a15e254ce82d', '4937a1c4-62c8-5d35-3433-527614265df0', 'reviews', 'review.created', 'Ulasan baru 4 bintang', 'Kemeja Batik Lengan Panjang Parang · Bahannya sesuai deskripsi, adem dipakai seharian. Jahitan rapi, packing juga aman pakai...', 'product_review', '1', '/admin/reviews/1', '{\"rating\": 4}', '2026-11-13 23:24:37', 1, '2026-11-13 22:24:37', '2026-11-13 22:24:37', NULL),
(16, 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, 'promotions', 'promotion.submitted', 'Promosi menunggu persetujuan', 'Promo Payday Akhir Bulan', 'promotion', '7', '/admin/promotions?promotion=7', '{\"approval_status\": \"pending\"}', NULL, 1, '2026-11-14 01:09:37', '2026-11-14 01:09:37', NULL),
(17, 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, 'finance', 'finance.payout', 'Dana marketplace cair', 'Rp 6.250.000 masuk ke rekening BCA · pencairan Shopee & TikTok', 'financial_transaction', NULL, '/admin/finance', '{\"amount\": 6250000}', '2026-11-13 02:24:37', 1, '2026-11-12 23:24:37', '2026-11-12 23:24:37', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `app_settings`
--

CREATE TABLE `app_settings` (
  `id` bigint UNSIGNED NOT NULL,
  `group` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'general',
  `key` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci,
  `type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'string',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `app_settings`
--

INSERT INTO `app_settings` (`id`, `group`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES
(1, 'store', 'store.name', 'Fashionku', 'string', '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(2, 'store', 'store.slug', 'fashionku', 'string', '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(3, 'store', 'store.description', 'Fashionku adalah destination fashion modern untuk pria dan wanita. Kami menghadirkan pakaian, alas kaki, tas, dan aksesori berkualitas dengan ukuran lengkap, warna trendi, dan pengiriman ke seluruh Indonesia.', 'string', '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(4, 'store', 'store.short_description', 'Destination fashion pria & wanita. Ukuran lengkap, pengiriman ke seluruh Indonesia.', 'string', '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(5, 'store', 'store.phone', '081234567890', 'string', '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(6, 'store', 'store.email', 'halo@fashionku.id', 'string', '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(7, 'store', 'store.city', 'Bandung', 'string', '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(8, 'store', 'store.province', 'Jawa Barat', 'string', '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(9, 'store', 'store.address', 'Jl. Cihampelas No. 120, Bandung', 'string', '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(10, 'store', 'store.is_active', '1', 'boolean', '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(11, 'store', 'store.logo', 'https://picsum.photos/seed/fashionku-logo/400/400', 'string', '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(12, 'store', 'store.banner_url', 'https://picsum.photos/seed/fashionku-banner/1440/400', 'string', '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(13, 'store', 'store.owner_name', 'Nadia Prameswari', 'string', '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(14, 'store', 'store.owner_phone', '081234567890', 'string', '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(15, 'store', 'store.detail_description', 'Butik fashion online dengan koleksi pria dan wanita, ukuran lengkap S-XXL, dan pengiriman cepat.', 'string', '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(16, 'store', 'store.shipping_policy', 'Pesanan diproses maksimal 2x24 jam kerja. Gratis ongkir untuk pembelian di atas Rp300.000.', 'string', '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(17, 'store', 'store.return_policy', 'Pengembalian maksimal 7 hari setelah diterima dengan kondisi asli, label utuh, belum dipakai, dan kemasan lengkap.', 'string', '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(18, 'store', 'store.open_days', 'Senin s/d Minggu', 'string', '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(19, 'store', 'store.open_time', '08:00:00', 'string', '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(20, 'store', 'store.close_time', '21:00:00', 'string', '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(21, 'store', 'store.whatsapp_url', 'https://wa.me/6281234567890', 'string', '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(22, 'store', 'store.instagram_url', 'https://instagram.com/fashionku.id', 'string', '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(23, 'store', 'store.updated_at', '2026-11-14 09:23:41', 'string', '2026-11-14 02:23:41', '2026-11-14 02:23:41');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('fashionku-cache-5c785c036466adea360111aa28563bfd556b5fba', 'i:2;', 1794743179),
('fashionku-cache-5c785c036466adea360111aa28563bfd556b5fba:timer', 'i:1794743179;', 1794743179),
('fashionku-cache-catalog_categories_menu_rows_active_v3', 'a:23:{i:0;a:12:{s:2:\"id\";i:12;s:9:\"parent_id\";N;s:5:\"level\";i:1;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:10:\"Gaya Hidup\";s:4:\"slug\";s:10:\"gaya-hidup\";s:9:\"full_slug\";s:10:\"gaya-hidup\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:1;a:12:{s:2:\"id\";i:1;s:9:\"parent_id\";N;s:5:\"level\";i:1;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:7:\"Pakaian\";s:4:\"slug\";s:7:\"pakaian\";s:9:\"full_slug\";s:7:\"pakaian\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:2;a:12:{s:2:\"id\";i:13;s:9:\"parent_id\";i:12;s:5:\"level\";i:2;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:9:\"Alas Kaki\";s:4:\"slug\";s:9:\"alas-kaki\";s:9:\"full_slug\";s:20:\"gaya-hidup/alas-kaki\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:3;a:12:{s:2:\"id\";i:2;s:9:\"parent_id\";i:1;s:5:\"level\";i:2;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:12:\"Pakaian Pria\";s:4:\"slug\";s:12:\"pakaian-pria\";s:9:\"full_slug\";s:20:\"pakaian/pakaian-pria\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:4;a:12:{s:2:\"id\";i:7;s:9:\"parent_id\";i:1;s:5:\"level\";i:2;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:14:\"Pakaian Wanita\";s:4:\"slug\";s:14:\"pakaian-wanita\";s:9:\"full_slug\";s:22:\"pakaian/pakaian-wanita\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:5;a:12:{s:2:\"id\";i:16;s:9:\"parent_id\";i:12;s:5:\"level\";i:2;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:3:\"Tas\";s:4:\"slug\";s:3:\"tas\";s:9:\"full_slug\";s:14:\"gaya-hidup/tas\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:6;a:12:{s:2:\"id\";i:20;s:9:\"parent_id\";i:12;s:5:\"level\";i:2;s:10:\"sort_order\";i:30;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:8:\"Aksesori\";s:4:\"slug\";s:8:\"aksesori\";s:9:\"full_slug\";s:19:\"gaya-hidup/aksesori\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:0;}i:7;a:12:{s:2:\"id\";i:8;s:9:\"parent_id\";i:7;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:5:\"Dress\";s:4:\"slug\";s:5:\"dress\";s:9:\"full_slug\";s:28:\"pakaian/pakaian-wanita/dress\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:8;}i:8;a:12:{s:2:\"id\";i:21;s:9:\"parent_id\";i:20;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:10:\"Jam Tangan\";s:4:\"slug\";s:10:\"jam-tangan\";s:9:\"full_slug\";s:30:\"gaya-hidup/aksesori/jam-tangan\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:5;}i:9;a:12:{s:2:\"id\";i:3;s:9:\"parent_id\";i:2;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:4:\"Kaos\";s:4:\"slug\";s:4:\"kaos\";s:9:\"full_slug\";s:25:\"pakaian/pakaian-pria/kaos\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:10;}i:10;a:12:{s:2:\"id\";i:14;s:9:\"parent_id\";i:13;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:6:\"Sepatu\";s:4:\"slug\";s:6:\"sepatu\";s:9:\"full_slug\";s:27:\"gaya-hidup/alas-kaki/sepatu\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:12;}i:11;a:12:{s:2:\"id\";i:17;s:9:\"parent_id\";i:16;s:5:\"level\";i:3;s:10:\"sort_order\";i:10;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:10:\"Tas Ransel\";s:4:\"slug\";s:10:\"tas-ransel\";s:9:\"full_slug\";s:25:\"gaya-hidup/tas/tas-ransel\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:5;}i:12;a:12:{s:2:\"id\";i:9;s:9:\"parent_id\";i:7;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:13:\"Blus & Atasan\";s:4:\"slug\";s:4:\"blus\";s:9:\"full_slug\";s:27:\"pakaian/pakaian-wanita/blus\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:8;}i:13;a:12:{s:2:\"id\";i:22;s:9:\"parent_id\";i:20;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:8:\"Kacamata\";s:4:\"slug\";s:8:\"kacamata\";s:9:\"full_slug\";s:28:\"gaya-hidup/aksesori/kacamata\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:3;}i:14;a:12:{s:2:\"id\";i:4;s:9:\"parent_id\";i:2;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:6:\"Kemeja\";s:4:\"slug\";s:6:\"kemeja\";s:9:\"full_slug\";s:27:\"pakaian/pakaian-pria/kemeja\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:8;}i:15;a:12:{s:2:\"id\";i:15;s:9:\"parent_id\";i:13;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:6:\"Sandal\";s:4:\"slug\";s:6:\"sandal\";s:9:\"full_slug\";s:27:\"gaya-hidup/alas-kaki/sandal\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:3;}i:16;a:12:{s:2:\"id\";i:18;s:9:\"parent_id\";i:16;s:5:\"level\";i:3;s:10:\"sort_order\";i:20;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:13:\"Tas Selempang\";s:4:\"slug\";s:13:\"tas-selempang\";s:9:\"full_slug\";s:28:\"gaya-hidup/tas/tas-selempang\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:6;}i:17;a:12:{s:2:\"id\";i:19;s:9:\"parent_id\";i:16;s:5:\"level\";i:3;s:10:\"sort_order\";i:30;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:6:\"Dompet\";s:4:\"slug\";s:6:\"dompet\";s:9:\"full_slug\";s:21:\"gaya-hidup/tas/dompet\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:3;}i:18;a:12:{s:2:\"id\";i:5;s:9:\"parent_id\";i:2;s:5:\"level\";i:3;s:10:\"sort_order\";i:30;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:5:\"Jaket\";s:4:\"slug\";s:5:\"jaket\";s:9:\"full_slug\";s:26:\"pakaian/pakaian-pria/jaket\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:6;}i:19;a:12:{s:2:\"id\";i:23;s:9:\"parent_id\";i:20;s:5:\"level\";i:3;s:10:\"sort_order\";i:30;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:9:\"Perhiasan\";s:4:\"slug\";s:9:\"perhiasan\";s:9:\"full_slug\";s:29:\"gaya-hidup/aksesori/perhiasan\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:3;}i:20;a:12:{s:2:\"id\";i:10;s:9:\"parent_id\";i:7;s:5:\"level\";i:3;s:10:\"sort_order\";i:30;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:3:\"Rok\";s:4:\"slug\";s:3:\"rok\";s:9:\"full_slug\";s:26:\"pakaian/pakaian-wanita/rok\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:5;}i:21;a:12:{s:2:\"id\";i:6;s:9:\"parent_id\";i:2;s:5:\"level\";i:3;s:10:\"sort_order\";i:40;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:6:\"Celana\";s:4:\"slug\";s:11:\"celana-pria\";s:9:\"full_slug\";s:32:\"pakaian/pakaian-pria/celana-pria\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:6;}i:22;a:12:{s:2:\"id\";i:11;s:9:\"parent_id\";i:7;s:5:\"level\";i:3;s:10:\"sort_order\";i:40;s:9:\"is_active\";b:1;s:18:\"is_visible_in_menu\";b:1;s:4:\"name\";s:9:\"Outerwear\";s:4:\"slug\";s:12:\"outer-wanita\";s:9:\"full_slug\";s:35:\"pakaian/pakaian-wanita/outer-wanita\";s:9:\"image_url\";N;s:8:\"icon_url\";N;s:14:\"products_count\";i:4;}}', 1794746480),
('fashionku-cache-otp_rate_limit:google_login:akbarfahlevy39@gmail.com:127.0.0.1', 'i:2;', 1794654702),
('fashionku-cache-otp_rate_limit:register:akbarfahlevy39@gmail.com:127.0.0.1', 'i:3;', 1794654542);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `carts`
--

INSERT INTO `carts` (`id`, `user_id`, `created_at`, `updated_at`) VALUES
(1, '17aa9f53-81c1-7db5-a094-14b0cae5d4f2', '2026-11-14 02:23:41', '2026-11-14 02:21:02'),
(2, '581c734e-1148-d4a2-2ba7-f6d32cc31d0f', '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(3, '49be2788-69c8-d175-966e-a15bfc44a012', '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(4, '306cd17b-c0d6-b1b1-cf06-11f5c3ebfabc', '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(5, '01e1e35a-187c-d961-58ca-25d230056614', '2026-10-25 02:24:02', '2026-11-14 02:17:02'),
(6, '20fea1be-a8f1-ea19-daa2-891de5e06685', '2026-10-25 02:24:02', '2026-11-14 02:13:02'),
(7, 'd1158e10-1fb5-8d0b-7ab2-b5ad00354462', '2026-10-25 02:24:02', '2026-11-14 02:09:02'),
(8, '87ee7bc6-865f-4f03-f910-a1d267178717', '2026-10-25 02:24:02', '2026-11-14 02:05:02'),
(9, '83fcef72-cc4f-747a-ee98-7ca1bbda04f9', '2026-10-25 02:24:02', '2026-11-14 02:01:02'),
(10, '8422156d-3226-4379-1db3-86d8a6f18a5e', '2026-10-25 02:24:02', '2026-11-14 01:57:02'),
(11, 'a59b13c6-da0d-cc36-aa08-7fdb038f3e7a', '2026-10-25 02:24:02', '2026-11-14 01:53:02'),
(12, '05ae4bc5-19bf-91e6-d6d6-f78747261a7f', '2026-10-25 02:24:02', '2026-11-14 01:49:02'),
(13, 'fd1a4098-c0e9-2f33-f52d-b2b92cef814c', '2026-10-25 02:24:02', '2026-11-14 01:45:02'),
(14, '0112d875-50e7-9f82-e3db-8b236203ae0c', '2026-10-25 02:24:02', '2026-11-14 01:41:02'),
(15, '2c230d3d-c8f6-ebf9-80d8-9238d4f2941a', '2026-10-25 02:24:02', '2026-11-14 01:37:02'),
(16, 'c323571d-d64c-f97c-2808-140d3610f2eb', '2026-10-25 02:24:02', '2026-11-14 01:33:02'),
(17, '2f5b0694-e364-f9bd-e445-034953d50131', '2026-10-25 02:24:02', '2026-11-14 01:29:02'),
(18, '0fa38f39-7c4b-b50a-4de5-5843c793c295', '2026-10-25 02:24:02', '2026-11-14 01:25:02'),
(19, 'fb22fb2e-476d-d51c-8f73-08aa30e70f4b', '2026-10-25 02:24:02', '2026-11-14 01:21:02'),
(20, '4fe4a5a9-ca82-3950-aa71-8f06a919f0bf', '2026-10-25 02:24:02', '2026-11-14 01:17:02'),
(21, '1b27d6c4-11e9-13d0-67d2-810e998376cc', '2026-10-25 02:24:02', '2026-11-14 01:13:02'),
(22, '331429a9-ba63-a268-3e5d-49912a26b5df', '2026-10-25 02:24:02', '2026-11-14 01:09:02'),
(23, 'c0d89002-20de-8855-3335-a6eb7ec4038f', '2026-10-25 02:24:02', '2026-11-14 01:05:02'),
(24, 'b1bd0bd7-5142-a51a-9155-576acb2bc84e', '2026-10-25 02:24:02', '2026-11-14 01:01:02'),
(25, '3221a57c-2610-e0e3-593c-6b7c8f444086', '2026-10-25 02:24:02', '2026-11-14 00:57:02'),
(26, 'dff1ab85-91bd-f4a1-f36c-a62f6c2ce82e', '2026-10-25 02:24:02', '2026-11-14 00:53:02'),
(27, 'e61c80b0-3705-187e-58b5-70d1edb6ed8f', '2026-10-25 02:24:02', '2026-11-14 00:49:02');

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `id` bigint UNSIGNED NOT NULL,
  `cart_id` bigint UNSIGNED NOT NULL,
  `product_variant_id` bigint UNSIGNED NOT NULL,
  `quantity` int UNSIGNED NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cart_items`
--

INSERT INTO `cart_items` (`id`, `cart_id`, `product_variant_id`, `quantity`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, '2026-11-14 02:21:02', '2026-11-14 02:21:02'),
(2, 5, 21, 1, '2026-11-14 02:17:02', '2026-11-14 02:17:02'),
(3, 6, 42, 1, '2026-11-14 02:13:02', '2026-11-14 02:13:02'),
(4, 7, 62, 1, '2026-11-14 02:09:02', '2026-11-14 02:09:02'),
(5, 8, 83, 1, '2026-11-14 02:05:02', '2026-11-14 02:05:02'),
(6, 9, 103, 1, '2026-11-14 02:01:02', '2026-11-14 02:01:02'),
(7, 10, 126, 1, '2026-11-14 01:57:02', '2026-11-14 01:57:02'),
(8, 11, 149, 1, '2026-11-14 01:53:02', '2026-11-14 01:53:02'),
(9, 12, 169, 1, '2026-11-14 01:49:02', '2026-11-14 01:49:02'),
(10, 13, 189, 1, '2026-11-14 01:45:02', '2026-11-14 01:45:02'),
(11, 14, 209, 1, '2026-11-14 01:41:02', '2026-11-14 01:41:02'),
(12, 15, 233, 1, '2026-11-14 01:37:02', '2026-11-14 01:37:02'),
(13, 16, 253, 1, '2026-11-14 01:33:02', '2026-11-14 01:33:02'),
(14, 17, 273, 1, '2026-11-14 01:29:02', '2026-11-14 01:29:02'),
(15, 18, 293, 1, '2026-11-14 01:25:02', '2026-11-14 01:25:02'),
(16, 19, 319, 1, '2026-11-14 01:21:02', '2026-11-14 01:21:02'),
(17, 20, 11, 1, '2026-11-14 01:17:02', '2026-11-14 01:17:02'),
(18, 21, 31, 1, '2026-11-14 01:13:02', '2026-11-14 01:13:02'),
(19, 22, 52, 1, '2026-11-14 01:09:02', '2026-11-14 01:09:02'),
(20, 23, 72, 1, '2026-11-14 01:05:02', '2026-11-14 01:05:02'),
(21, 24, 93, 1, '2026-11-14 01:01:02', '2026-11-14 01:01:02'),
(22, 25, 116, 1, '2026-11-14 00:57:02', '2026-11-14 00:57:02'),
(23, 26, 136, 1, '2026-11-14 00:53:02', '2026-11-14 00:53:02'),
(24, 27, 159, 1, '2026-11-14 00:49:02', '2026-11-14 00:49:02');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint UNSIGNED NOT NULL,
  `parent_id` bigint UNSIGNED DEFAULT NULL,
  `parent_scope_id` bigint UNSIGNED NOT NULL DEFAULT '0',
  `level` tinyint UNSIGNED NOT NULL DEFAULT '1',
  `sort_order` int UNSIGNED NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_visible_in_menu` tinyint(1) NOT NULL DEFAULT '1',
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `icon_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_by` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `parent_id`, `parent_scope_id`, `level`, `sort_order`, `is_active`, `is_visible_in_menu`, `name`, `slug`, `full_slug`, `image_url`, `icon_url`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, NULL, 0, 1, 10, 1, 1, 'Pakaian', 'pakaian', 'pakaian', NULL, NULL, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 02:23:55', '2026-11-14 02:23:55', NULL),
(2, 1, 1, 2, 10, 1, 1, 'Pakaian Pria', 'pakaian-pria', 'pakaian/pakaian-pria', NULL, NULL, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 02:23:55', '2026-11-14 02:23:55', NULL),
(3, 2, 2, 3, 10, 1, 1, 'Kaos', 'kaos', 'pakaian/pakaian-pria/kaos', NULL, NULL, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 02:23:55', '2026-11-14 02:23:55', NULL),
(4, 2, 2, 3, 20, 1, 1, 'Kemeja', 'kemeja', 'pakaian/pakaian-pria/kemeja', NULL, NULL, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 02:23:55', '2026-11-14 02:23:55', NULL),
(5, 2, 2, 3, 30, 1, 1, 'Jaket', 'jaket', 'pakaian/pakaian-pria/jaket', NULL, NULL, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 02:23:55', '2026-11-14 02:23:55', NULL),
(6, 2, 2, 3, 40, 1, 1, 'Celana', 'celana-pria', 'pakaian/pakaian-pria/celana-pria', NULL, NULL, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 02:23:55', '2026-11-14 02:23:55', NULL),
(7, 1, 1, 2, 20, 1, 1, 'Pakaian Wanita', 'pakaian-wanita', 'pakaian/pakaian-wanita', NULL, NULL, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 02:23:55', '2026-11-14 02:23:55', NULL),
(8, 7, 7, 3, 10, 1, 1, 'Dress', 'dress', 'pakaian/pakaian-wanita/dress', NULL, NULL, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 02:23:55', '2026-11-14 02:23:55', NULL),
(9, 7, 7, 3, 20, 1, 1, 'Blus & Atasan', 'blus', 'pakaian/pakaian-wanita/blus', NULL, NULL, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 02:23:55', '2026-11-14 02:23:55', NULL),
(10, 7, 7, 3, 30, 1, 1, 'Rok', 'rok', 'pakaian/pakaian-wanita/rok', NULL, NULL, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 02:23:55', '2026-11-14 02:23:55', NULL),
(11, 7, 7, 3, 40, 1, 1, 'Outerwear', 'outer-wanita', 'pakaian/pakaian-wanita/outer-wanita', NULL, NULL, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 02:23:55', '2026-11-14 02:23:55', NULL),
(12, NULL, 0, 1, 10, 1, 1, 'Gaya Hidup', 'gaya-hidup', 'gaya-hidup', NULL, NULL, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 02:23:55', '2026-11-14 02:23:55', NULL),
(13, 12, 12, 2, 10, 1, 1, 'Alas Kaki', 'alas-kaki', 'gaya-hidup/alas-kaki', NULL, NULL, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 02:23:55', '2026-11-14 02:23:55', NULL),
(14, 13, 13, 3, 10, 1, 1, 'Sepatu', 'sepatu', 'gaya-hidup/alas-kaki/sepatu', NULL, NULL, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 02:23:55', '2026-11-14 02:23:55', NULL),
(15, 13, 13, 3, 20, 1, 1, 'Sandal', 'sandal', 'gaya-hidup/alas-kaki/sandal', NULL, NULL, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 02:23:55', '2026-11-14 02:23:55', NULL),
(16, 12, 12, 2, 20, 1, 1, 'Tas', 'tas', 'gaya-hidup/tas', NULL, NULL, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 02:23:55', '2026-11-14 02:23:55', NULL),
(17, 16, 16, 3, 10, 1, 1, 'Tas Ransel', 'tas-ransel', 'gaya-hidup/tas/tas-ransel', NULL, NULL, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 02:23:55', '2026-11-14 02:23:55', NULL),
(18, 16, 16, 3, 20, 1, 1, 'Tas Selempang', 'tas-selempang', 'gaya-hidup/tas/tas-selempang', NULL, NULL, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 02:23:55', '2026-11-14 02:23:55', NULL),
(19, 16, 16, 3, 30, 1, 1, 'Dompet', 'dompet', 'gaya-hidup/tas/dompet', NULL, NULL, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 02:23:55', '2026-11-14 02:23:55', NULL),
(20, 12, 12, 2, 30, 1, 1, 'Aksesori', 'aksesori', 'gaya-hidup/aksesori', NULL, NULL, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 02:23:55', '2026-11-14 02:23:55', NULL),
(21, 20, 20, 3, 10, 1, 1, 'Jam Tangan', 'jam-tangan', 'gaya-hidup/aksesori/jam-tangan', NULL, NULL, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 02:23:55', '2026-11-14 02:23:55', NULL),
(22, 20, 20, 3, 20, 1, 1, 'Kacamata', 'kacamata', 'gaya-hidup/aksesori/kacamata', NULL, NULL, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 02:23:55', '2026-11-14 02:23:55', NULL),
(23, 20, 20, 3, 30, 1, 1, 'Perhiasan', 'perhiasan', 'gaya-hidup/aksesori/perhiasan', NULL, NULL, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 02:23:55', '2026-11-14 02:23:55', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `chat_messages`
--

CREATE TABLE `chat_messages` (
  `id` bigint UNSIGNED NOT NULL,
  `conversation_id` bigint UNSIGNED NOT NULL,
  `sender_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message_type` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'text',
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `attachments` json DEFAULT NULL,
  `edited_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `chat_messages`
--

INSERT INTO `chat_messages` (`id`, `conversation_id`, `sender_id`, `message_type`, `message`, `attachments`, `edited_at`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, '49be2788-69c8-d175-966e-a15bfc44a012', 'text', 'Kak, kaos oversize cream size L masih ready?', NULL, NULL, '2026-11-14 01:23:37', '2026-11-14 01:23:37', NULL),
(2, 1, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'text', 'Halo Kak Sinta, ready. Stok terakhir 4 pcs untuk size L.', NULL, NULL, '2026-11-14 01:38:37', '2026-11-14 01:38:37', NULL),
(3, 1, '49be2788-69c8-d175-966e-a15bfc44a012', 'text', 'Oke, kalau tinggi 165 cm berat 55 kg mending L atau XL ya?', NULL, NULL, '2026-11-14 01:54:37', '2026-11-14 01:54:37', NULL),
(4, 1, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'text', 'Lebih aman L Kak, potongannya sudah oversize. Kalau mau lebih longgar bisa XL.', NULL, NULL, '2026-11-14 02:09:37', '2026-11-14 02:09:37', NULL),
(5, 2, '306cd17b-c0d6-b1b1-cf06-11f5c3ebfabc', 'text', 'Halo, pesanan saya bisa dikirim hari ini? Mau dipakai Sabtu.', NULL, NULL, '2026-11-14 00:58:37', '2026-11-14 00:58:37', NULL),
(6, 2, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'text', 'Bisa Kak Dimas, pesanan sudah masuk antrian packing. Insya Allah pickup sore ini.', NULL, NULL, '2026-11-14 01:19:37', '2026-11-14 01:19:37', NULL),
(7, 2, '306cd17b-c0d6-b1b1-cf06-11f5c3ebfabc', 'text', 'Siap, kalau bisa pilih JNE REG ya.', NULL, NULL, '2026-11-14 01:41:37', '2026-11-14 01:41:37', NULL),
(8, 2, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'text', 'Baik, sudah kami catat. Nomor resi menyusul lewat halaman pesanan.', NULL, NULL, '2026-11-14 02:02:37', '2026-11-14 02:02:37', NULL),
(9, 3, '581c734e-1148-d4a2-2ba7-f6d32cc31d0f', 'text', 'Kak, dress midi linen yang datang agak sempit di pinggang. Bisa tukar L?', NULL, NULL, '2026-11-13 23:47:37', '2026-11-13 23:47:37', NULL),
(10, 3, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'text', 'Bisa Kak Alya, label masih utuh ya? Nanti kami kirim panduan pengembaliannya.', NULL, NULL, '2026-11-14 00:39:37', '2026-11-14 00:39:37', NULL),
(11, 3, '581c734e-1148-d4a2-2ba7-f6d32cc31d0f', 'text', 'Masih utuh, belum dipakai keluar.', NULL, NULL, '2026-11-14 01:32:37', '2026-11-14 01:32:37', NULL),
(12, 4, '17aa9f53-81c1-7db5-a094-14b0cae5d4f2', 'text', 'Rekomendasi sepatu kerja yang nyaman dipakai seharian?', NULL, NULL, '2026-11-13 20:32:37', '2026-11-13 20:32:37', NULL),
(13, 4, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'text', 'Loafers kulit cokelat atau pantofel navy paling sering dipilih. Keduanya solnya empuk.', NULL, NULL, '2026-11-13 22:00:37', '2026-11-13 22:00:37', NULL),
(14, 4, '17aa9f53-81c1-7db5-a094-14b0cae5d4f2', 'text', 'Kalau ukuran 42 biasanya pakai 42 juga kan?', NULL, NULL, '2026-11-13 23:28:37', '2026-11-13 23:28:37', NULL),
(15, 4, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'text', 'Betul Kak, true to size. Kalau kaki agak lebar, naik setengah size tidak tersedia, jadi ambil 43.', NULL, NULL, '2026-11-14 00:56:37', '2026-11-14 00:56:37', NULL),
(16, 5, '306cd17b-c0d6-b1b1-cf06-11f5c3ebfabc', 'text', 'Bisa kirim invoice pesanan saya dalam bentuk PDF?', NULL, NULL, '2026-11-12 17:44:37', '2026-11-12 17:44:37', NULL),
(17, 5, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'text', 'Tentu, sudah kami kirim ke email yang terdaftar ya Kak.', NULL, NULL, '2026-11-13 10:04:37', '2026-11-13 10:04:37', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `chat_message_reads`
--

CREATE TABLE `chat_message_reads` (
  `message_id` bigint UNSIGNED NOT NULL,
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `read_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `chat_message_reads`
--

INSERT INTO `chat_message_reads` (`message_id`, `user_id`, `read_at`) VALUES
(12, '17aa9f53-81c1-7db5-a094-14b0cae5d4f2', '2026-11-13 20:34:37'),
(13, '17aa9f53-81c1-7db5-a094-14b0cae5d4f2', '2026-11-13 22:02:37'),
(14, '17aa9f53-81c1-7db5-a094-14b0cae5d4f2', '2026-11-13 23:30:37'),
(16, '306cd17b-c0d6-b1b1-cf06-11f5c3ebfabc', '2026-11-12 17:46:37'),
(5, '306cd17b-c0d6-b1b1-cf06-11f5c3ebfabc', '2026-11-14 01:00:37'),
(6, '306cd17b-c0d6-b1b1-cf06-11f5c3ebfabc', '2026-11-14 01:21:37'),
(7, '306cd17b-c0d6-b1b1-cf06-11f5c3ebfabc', '2026-11-14 01:43:37'),
(1, '49be2788-69c8-d175-966e-a15bfc44a012', '2026-11-14 01:25:37'),
(2, '49be2788-69c8-d175-966e-a15bfc44a012', '2026-11-14 01:40:37'),
(3, '49be2788-69c8-d175-966e-a15bfc44a012', '2026-11-14 01:56:37'),
(9, '581c734e-1148-d4a2-2ba7-f6d32cc31d0f', '2026-11-13 23:49:37'),
(10, '581c734e-1148-d4a2-2ba7-f6d32cc31d0f', '2026-11-14 00:41:37'),
(11, '581c734e-1148-d4a2-2ba7-f6d32cc31d0f', '2026-11-14 01:32:37'),
(16, 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-12 17:47:37'),
(17, 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-13 10:04:37'),
(12, 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-13 20:35:37'),
(13, 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-13 22:03:37'),
(14, 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-13 23:31:37'),
(9, 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-13 23:50:37'),
(10, 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 00:42:37'),
(15, 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 00:56:37'),
(5, 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 01:01:37'),
(6, 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 01:22:37'),
(1, 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 01:26:37'),
(2, 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 01:41:37'),
(7, 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 01:44:37'),
(3, 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 01:57:37'),
(8, 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 02:02:37'),
(4, 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 02:09:37');

-- --------------------------------------------------------

--
-- Table structure for table `code_patterns`
--

CREATE TABLE `code_patterns` (
  `id` bigint UNSIGNED NOT NULL,
  `type` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pattern` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `conversations`
--

CREATE TABLE `conversations` (
  `id` bigint UNSIGNED NOT NULL,
  `type` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'direct',
  `order_id` bigint UNSIGNED DEFAULT NULL,
  `subject` varchar(180) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_role` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_by` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `conversations`
--

INSERT INTO `conversations` (`id`, `type`, `order_id`, `subject`, `target_role`, `is_active`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'direct', NULL, 'Stok kaos oversize cream', NULL, 1, '49be2788-69c8-d175-966e-a15bfc44a012', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 01:08:37', '2026-11-14 02:08:37', NULL),
(2, 'order', 2, 'Pesanan mau dikirim hari ini', NULL, 1, '306cd17b-c0d6-b1b1-cf06-11f5c3ebfabc', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 00:36:37', '2026-11-14 01:36:37', NULL),
(3, 'order', 1, 'Tukar ukuran dress midi', NULL, 1, '581c734e-1148-d4a2-2ba7-f6d32cc31d0f', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-13 22:54:37', '2026-11-13 23:54:37', NULL),
(4, 'direct', NULL, 'Rekomendasi sepatu kerja pria', NULL, 1, '17aa9f53-81c1-7db5-a094-14b0cae5d4f2', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-13 19:04:37', '2026-11-13 20:04:37', NULL),
(5, 'order', 3, 'Invoice pesanan untuk reimbursement', NULL, 1, '306cd17b-c0d6-b1b1-cf06-11f5c3ebfabc', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-12 01:24:37', '2026-11-12 02:24:37', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `conversation_participants`
--

CREATE TABLE `conversation_participants` (
  `conversation_id` bigint UNSIGNED NOT NULL,
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_read_at` timestamp NULL DEFAULT NULL,
  `joined_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `left_at` timestamp NULL DEFAULT NULL,
  `is_muted` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `conversation_participants`
--

INSERT INTO `conversation_participants` (`conversation_id`, `user_id`, `last_read_at`, `joined_at`, `left_at`, `is_muted`) VALUES
(1, '49be2788-69c8-d175-966e-a15bfc44a012', '2026-11-14 02:08:37', '2026-11-14 01:08:37', NULL, 0),
(1, 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 01:38:37', '2026-11-14 01:08:37', NULL, 0),
(2, '306cd17b-c0d6-b1b1-cf06-11f5c3ebfabc', '2026-11-14 01:36:37', '2026-11-14 00:36:37', NULL, 0),
(2, 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 01:06:37', '2026-11-14 00:36:37', NULL, 0),
(3, '581c734e-1148-d4a2-2ba7-f6d32cc31d0f', '2026-11-13 23:54:37', '2026-11-13 22:54:37', NULL, 0),
(3, 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-13 23:54:37', '2026-11-13 22:54:37', NULL, 0),
(4, '17aa9f53-81c1-7db5-a094-14b0cae5d4f2', '2026-11-13 20:04:37', '2026-11-13 19:04:37', NULL, 0),
(4, 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-13 20:04:37', '2026-11-13 19:04:37', NULL, 0),
(5, '306cd17b-c0d6-b1b1-cf06-11f5c3ebfabc', '2026-11-12 02:24:37', '2026-11-12 01:24:37', NULL, 0),
(5, 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-12 02:24:37', '2026-11-12 01:24:37', NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `financial_payment_histories`
--

CREATE TABLE `financial_payment_histories` (
  `id` bigint UNSIGNED NOT NULL,
  `financial_transaction_id` bigint UNSIGNED NOT NULL,
  `recorded_by` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` decimal(15,2) NOT NULL,
  `balance_before` decimal(15,2) NOT NULL,
  `balance_after` decimal(15,2) NOT NULL,
  `payment_method` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'manual',
  `reference_number` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `paid_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `financial_payment_histories`
--

INSERT INTO `financial_payment_histories` (`id`, `financial_transaction_id`, `recorded_by`, `amount`, `balance_before`, `balance_after`, `payment_method`, `reference_number`, `notes`, `paid_at`, `created_at`, `updated_at`) VALUES
(1, 83, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 6000000.00, 12400000.00, 6400000.00, 'bank_transfer', 'TRF-20261114-001', 'Pembayaran termin pertama', '2026-11-10 07:20:00', '2026-11-10 07:20:00', '2026-11-10 07:20:00'),
(2, 85, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 2100000.00, 2100000.00, 0.00, 'bank_transfer', 'TRF-20261114-003', 'Pelunasan tagihan supplier', '2026-11-08 07:20:00', '2026-11-08 07:20:00', '2026-11-08 07:20:00'),
(3, 86, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 5000000.00, 15000000.00, 10000000.00, 'bank_transfer', 'TRF-20261114-004', 'Pembayaran termin pertama', '2026-11-07 07:20:00', '2026-11-07 07:20:00', '2026-11-07 07:20:00'),
(4, 88, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 1700000.00, 3400000.00, 1700000.00, 'bank_transfer', 'RCV-TRF-20261114-2', 'Pembayaran sebagian dari reseller', '2026-11-12 09:05:00', '2026-11-12 09:05:00', '2026-11-12 09:05:00');

-- --------------------------------------------------------

--
-- Table structure for table `financial_transactions`
--

CREATE TABLE `financial_transactions` (
  `id` bigint UNSIGNED NOT NULL,
  `order_id` bigint UNSIGNED DEFAULT NULL,
  `user_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reference_number` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(160) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `amount` decimal(15,2) NOT NULL,
  `paid_amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `status` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'open',
  `due_date` date DEFAULT NULL,
  `occurred_at` timestamp NOT NULL,
  `settled_at` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `metadata` json DEFAULT NULL,
  `created_by` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_by` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `financial_transactions`
--

INSERT INTO `financial_transactions` (`id`, `order_id`, `user_id`, `reference_number`, `type`, `category`, `title`, `description`, `amount`, `paid_amount`, `status`, `due_date`, `occurred_at`, `settled_at`, `is_active`, `metadata`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 53, '4937a1c4-62c8-5d35-3433-527614265df0', 'INC-20261113190002-A71CB', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20261110-9052-1', 'Order product Kemeja Batik Lengan Panjang Parang x1, Celana Cargo Ripstop Olive x1 dengan jumlah 2 nomor order FKU-20261110-9052', 648000.00, 0.00, 'posted', NULL, '2026-11-13 12:00:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20261110-9052-1\", \"sub_order_id\": 53}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-13 12:00:02', '2026-11-13 12:00:02', NULL),
(2, 57, '5e73f21e-65ff-583e-b0b2-49790262bd99', 'INC-20261113154102-AE501', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20261109-9056-1', 'Order product Celana Formal Wool Blend Hitam x1, Blus Kerah Peter Pan Putih x2, Blazer Oversized Linen Oat x1 dengan jumlah 4 nomor order FKU-20261109-9056', 1256000.00, 0.00, 'posted', NULL, '2026-11-13 08:41:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20261109-9056-1\", \"sub_order_id\": 57}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-13 08:41:02', '2026-11-13 08:41:02', NULL),
(3, 61, 'ecb48677-ccbf-7d3d-76fd-8944218e0781', 'INC-20261113122302-0959C', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20261108-9060-1', 'Order product Blus Oversized Poplin Navy x2 dengan jumlah 2 nomor order FKU-20261108-9060', 458000.00, 0.00, 'posted', NULL, '2026-11-13 05:23:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20261108-9060-1\", \"sub_order_id\": 61}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-13 05:23:02', '2026-11-13 05:23:02', NULL),
(4, 65, '36333497-c72b-06cc-4875-815d9af60356', 'INC-20261113090402-25552', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20261107-9064-1', 'Order product Bomber Satin Wanita Sage x1, Heels Blok Tali Hitam x1 dengan jumlah 2 nomor order FKU-20261107-9064', 708000.00, 0.00, 'posted', NULL, '2026-11-13 02:04:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20261107-9064-1\", \"sub_order_id\": 65}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-13 02:04:02', '2026-11-13 02:04:02', NULL),
(5, 67, 'c867f90f-7824-10fe-2aa3-2359ffe920a3', 'INC-20261113072502-171E2', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20261107-9066-1', 'Order product Pantofel Kulit Asli Navy x2 dengan jumlah 2 nomor order FKU-20261107-9066', 1298000.00, 0.00, 'posted', NULL, '2026-11-13 00:25:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20261107-9066-1\", \"sub_order_id\": 67}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-13 00:25:02', '2026-11-13 00:25:02', NULL),
(6, 68, '3dbd1354-8f7a-40b0-6247-23fcd4c8f491', 'INC-20261113063502-3F613', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20261106-9067-1', 'Order product Sneakers Running Knit Abu x1, Tas Selempang Kulit Cokelat x1 dengan jumlah 2 nomor order FKU-20261106-9067', 838000.00, 0.00, 'posted', NULL, '2026-11-12 23:35:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20261106-9067-1\", \"sub_order_id\": 68}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-12 23:35:02', '2026-11-12 23:35:02', NULL),
(7, 69, '8c0d42e6-e169-f777-614c-4c86da4b386d', 'INC-20261113054602-5B63C', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20261106-9068-1', 'Order product Sneakers Slip-On Denim x1, Kacamata Bulat Frame Emas x2, Kemeja Oxford Slim Fit Putih x1 dengan jumlah 4 nomor order FKU-20261106-9068', 1246000.00, 0.00, 'posted', NULL, '2026-11-12 22:46:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20261106-9068-1\", \"sub_order_id\": 69}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-12 22:46:02', '2026-11-12 22:46:02', NULL),
(8, 70, '1b27d6c4-11e9-13d0-67d2-810e998376cc', 'INC-20261113045602-31FCF', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20261106-9069-1', 'Order product Sandal Slide Puffy Hitam x2 dengan jumlah 2 nomor order FKU-20261106-9069', 238000.00, 0.00, 'posted', NULL, '2026-11-12 21:56:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20261106-9069-1\", \"sub_order_id\": 70}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-12 21:56:02', '2026-11-12 21:56:02', NULL),
(9, 71, 'd741cf38-85e7-6fdc-bfb4-e9f01fa0ac4a', 'INC-20261113040602-FDE2F', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20261106-9070-1', 'Order product Sandal Sport Outdoor Abu x1, Kemeja Linen Oversize Khaki x1 dengan jumlah 2 nomor order FKU-20261106-9070', 538000.00, 0.00, 'posted', NULL, '2026-11-12 21:06:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20261106-9070-1\", \"sub_order_id\": 71}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-12 21:06:02', '2026-11-12 21:06:02', NULL),
(10, 72, '53c58789-9a09-c2a9-e0cd-c840a7530ddb', 'INC-20261113031702-99E2F', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20261106-9071-1', 'Order product Dompet Kartu Slim Navy x1, Kemeja Linen Oversize Khaki x2, Jaket Kanvas Kerja Cokelat x1 dengan jumlah 4 nomor order FKU-20261106-9071', 1126000.00, 0.00, 'posted', NULL, '2026-11-12 20:17:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20261106-9071-1\", \"sub_order_id\": 72}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-12 20:17:02', '2026-11-12 20:17:02', NULL),
(11, 73, '865931e8-2cc7-befe-d1a4-40f2184e8564', 'INC-20261113022702-AEFB9', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20261105-9072-1', 'Order product Kemeja Linen Oversize Khaki x2 dengan jumlah 2 nomor order FKU-20261105-9072', 578000.00, 0.00, 'posted', NULL, '2026-11-12 19:27:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20261105-9072-1\", \"sub_order_id\": 73}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-12 19:27:02', '2026-11-12 19:27:02', NULL),
(12, 74, '8422156d-3226-4379-1db3-86d8a6f18a5e', 'INC-20261113013702-85F82', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20261105-9073-1', 'Order product Kemeja Linen Oversize Khaki x1, Kemeja Twill Asimetri Navy x1 dengan jumlah 2 nomor order FKU-20261105-9073', 508000.00, 0.00, 'posted', NULL, '2026-11-12 18:37:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20261105-9073-1\", \"sub_order_id\": 74}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-12 18:37:02', '2026-11-12 18:37:02', NULL),
(13, 75, 'd6279585-7e9d-a7d9-50b8-d20071ff20d5', 'INC-20261113004802-30A3F', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20261105-9074-1', 'Order product Kemeja Linen Oversize Khaki x1, Jaket Bomber Ripstop Hitam x2, Dress Midi Linen Krem x1 dengan jumlah 4 nomor order FKU-20261105-9074', 1486000.00, 0.00, 'posted', NULL, '2026-11-12 17:48:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20261105-9074-1\", \"sub_order_id\": 75}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-12 17:48:02', '2026-11-12 17:48:02', NULL),
(14, 76, '49be2788-69c8-d175-966e-a15bfc44a012', 'INC-20261112235802-363F4', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20261105-9075-1', 'Order product Kemeja Linen Oversize Khaki x2 dengan jumlah 2 nomor order FKU-20261105-9075', 578000.00, 0.00, 'posted', NULL, '2026-11-12 16:58:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20261105-9075-1\", \"sub_order_id\": 76}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-12 16:58:02', '2026-11-12 16:58:02', NULL),
(15, 77, '6fbb8c86-9231-b8a1-88d3-646663652350', 'INC-20261112230802-6E277', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20261104-9076-1', 'Order product Kemeja Batik Lengan Panjang Parang x1, Celana Cargo Ripstop Olive x1 dengan jumlah 2 nomor order FKU-20261104-9076', 648000.00, 0.00, 'posted', NULL, '2026-11-12 16:08:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20261104-9076-1\", \"sub_order_id\": 77}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-12 16:08:02', '2026-11-12 16:08:02', NULL),
(16, 78, 'c0d89002-20de-8855-3335-a6eb7ec4038f', 'INC-20261112221902-6AA33', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20261104-9077-1', 'Order product Jaket Denim Oversize Blue Washed x1, Celana Panjang Kanvas Cokelat x2, Blus Crop Boxy Cotton Pink x1 dengan jumlah 4 nomor order FKU-20261104-9077', 1026000.00, 0.00, 'posted', NULL, '2026-11-12 15:19:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20261104-9077-1\", \"sub_order_id\": 78}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-12 15:19:02', '2026-11-12 15:19:02', NULL),
(17, 79, '3b0b84b6-6ba3-0c40-a16d-a075b449aa0d', 'INC-20261112212902-CA897', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20261104-9078-1', 'Order product Jaket Hiking Softshell Abu x2 dengan jumlah 2 nomor order FKU-20261104-9078', 998000.00, 0.00, 'posted', NULL, '2026-11-12 14:29:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20261104-9078-1\", \"sub_order_id\": 79}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-12 14:29:02', '2026-11-12 14:29:02', NULL),
(18, 80, 'bf03fbce-d1d2-7300-136d-f61e4acdbe91', 'INC-20261112203902-5B010', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20261104-9079-1', 'Order product Celana Chino Slim Fit Khaki x1, Dress Sundress Tiered Gingham x1 dengan jumlah 2 nomor order FKU-20261104-9079', 398000.00, 0.00, 'posted', NULL, '2026-11-12 13:39:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20261104-9079-1\", \"sub_order_id\": 80}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-12 13:39:02', '2026-11-12 13:39:02', NULL),
(19, 81, '1e269f2c-8386-1ef0-ff8e-1494bf3746a3', 'INC-20261112195002-BA699', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20261103-9080-1', 'Order product Celana Formal Wool Blend Hitam x1, Blus Kerah Peter Pan Putih x2, Blazer Oversized Linen Oat x1 dengan jumlah 4 nomor order FKU-20261103-9080', 1256000.00, 0.00, 'posted', NULL, '2026-11-12 12:50:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20261103-9080-1\", \"sub_order_id\": 81}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-12 12:50:02', '2026-11-12 12:50:02', NULL),
(20, 83, '62846adc-59a0-1459-ca7b-6d67b7cb98bb', 'INC-20261112181102-4A9D5', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20261103-9082-1', 'Order product Dress Shirt Midi Denim Light x1, Rok Plisket Midi Hitam x1 dengan jumlah 2 nomor order FKU-20261103-9082', 538000.00, 0.00, 'posted', NULL, '2026-11-12 11:11:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20261103-9082-1\", \"sub_order_id\": 83}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-12 11:11:02', '2026-11-12 11:11:02', NULL),
(21, 84, 'dee09934-26d8-29d8-36e1-1781d5de4a77', 'INC-20261112172102-4DA94', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20261103-9083-1', 'Order product Dress Kemeja Midi Khaki x1, Rok Linen Panjang Sage x2, Boots Chelsea Kulit Cokelat x1 dengan jumlah 4 nomor order FKU-20261103-9083', 1296000.00, 0.00, 'posted', NULL, '2026-11-12 10:21:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20261103-9083-1\", \"sub_order_id\": 84}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-12 10:21:02', '2026-11-12 10:21:02', NULL),
(22, 85, '3321e0dd-e12f-8a1a-db98-d2bc759a8436', 'INC-20261112032402-41495', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20261030-9084-1', 'Order product Blus Oversized Poplin Navy x2 dengan jumlah 2 nomor order FKU-20261030-9084', 458000.00, 0.00, 'posted', NULL, '2026-11-11 20:24:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20261030-9084-1\", \"sub_order_id\": 85}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-11 20:24:02', '2026-11-11 20:24:02', NULL),
(23, 86, '3221a57c-2610-e0e3-593c-6b7c8f444086', 'INC-20261111232802-E55E0', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20261029-9085-1', 'Order product Blus Knit Cropped Cream x1, Sneakers Chunky Retro Silver x1 dengan jumlah 2 nomor order FKU-20261029-9085', 638000.00, 0.00, 'posted', NULL, '2026-11-11 16:28:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20261029-9085-1\", \"sub_order_id\": 86}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-11 16:28:02', '2026-11-11 16:28:02', NULL),
(24, 87, '487eb68d-0b76-e01a-b043-b572294cd606', 'INC-20261111193302-54478', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20261028-9086-1', 'Order product Rok Denim A-Line Mid Blue x1, Loafers Kulit Sintetis Cokelat x2, Sandal Slide Puffy Hitam x1 dengan jumlah 4 nomor order FKU-20261028-9086', 1146000.00, 0.00, 'posted', NULL, '2026-11-11 12:33:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20261028-9086-1\", \"sub_order_id\": 87}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-11 12:33:02', '2026-11-11 12:33:02', NULL),
(25, 88, '38a478fc-af46-dab9-a7f9-ebe250220e5c', 'INC-20261111153702-9BAA5', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20261027-9087-1', 'Order product Blazer Oversized Linen Oat x2 dengan jumlah 2 nomor order FKU-20261027-9087', 718000.00, 0.00, 'posted', NULL, '2026-11-11 08:37:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20261027-9087-1\", \"sub_order_id\": 88}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-11 08:37:02', '2026-11-11 08:37:02', NULL),
(26, 89, '306cd17b-c0d6-b1b1-cf06-11f5c3ebfabc', 'INC-20261111114102-1B297', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20261026-9088-1', 'Order product Bomber Satin Wanita Sage x1, Heels Blok Tali Hitam x1 dengan jumlah 2 nomor order FKU-20261026-9088', 708000.00, 0.00, 'posted', NULL, '2026-11-11 04:41:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20261026-9088-1\", \"sub_order_id\": 89}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-11 04:41:02', '2026-11-11 04:41:02', NULL),
(27, 90, '0112d875-50e7-9f82-e3db-8b236203ae0c', 'INC-20261111074602-F54B2', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20261024-9089-1', 'Order product Sepatu Kulit Formal Oxford Hitam x1, Pantofel Wanita Nude x2, Jaket Denim Oversize Blue Washed x1 dengan jumlah 4 nomor order FKU-20261024-9089', 1576000.00, 0.00, 'posted', NULL, '2026-11-11 00:46:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20261024-9089-1\", \"sub_order_id\": 90}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-11 00:46:02', '2026-11-11 00:46:02', NULL),
(28, 91, '83981746-29d9-2a4e-4c3d-45ae19bcb789', 'INC-20261111035002-60035', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20261023-9090-1', 'Order product Pantofel Kulit Asli Navy x2 dengan jumlah 2 nomor order FKU-20261023-9090', 1298000.00, 0.00, 'posted', NULL, '2026-11-10 20:50:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20261023-9090-1\", \"sub_order_id\": 91}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-10 20:50:02', '2026-11-10 20:50:02', NULL),
(29, 92, 'a83143c9-3367-62a4-1a5c-d250674a1646', 'INC-20261110235402-D9F48', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20261022-9091-1', 'Order product Sneakers Running Knit Abu x1, Tas Selempang Kulit Cokelat x1 dengan jumlah 2 nomor order FKU-20261022-9091', 838000.00, 0.00, 'posted', NULL, '2026-11-10 16:54:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20261022-9091-1\", \"sub_order_id\": 92}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-10 16:54:02', '2026-11-10 16:54:02', NULL),
(30, 93, '7bdd6f0a-3f48-e6e8-ee16-ec8e84ff19ca', 'INC-20261110195902-12E69', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20261021-9092-1', 'Order product Sneakers Slip-On Denim x1, Kacamata Bulat Frame Emas x2, Jaket Bomber Ripstop Hitam x1 dengan jumlah 4 nomor order FKU-20261021-9092', 1446000.00, 0.00, 'posted', NULL, '2026-11-10 12:59:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20261021-9092-1\", \"sub_order_id\": 93}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-10 12:59:02', '2026-11-10 12:59:02', NULL),
(31, 94, 'e61c80b0-3705-187e-58b5-70d1edb6ed8f', 'INC-20261110160302-D89E2', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20261020-9093-1', 'Order product Sandal Slide Puffy Hitam x2 dengan jumlah 2 nomor order FKU-20261020-9093', 238000.00, 0.00, 'posted', NULL, '2026-11-10 09:03:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20261020-9093-1\", \"sub_order_id\": 94}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-10 09:03:02', '2026-11-10 09:03:02', NULL),
(32, 95, '6523275d-f48d-41a5-0d49-72d139ce2711', 'INC-20261110120802-6A4B1', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20261019-9094-1', 'Order product Sandal Sport Outdoor Abu x1, Jaket Bomber Ripstop Hitam x1 dengan jumlah 2 nomor order FKU-20261019-9094', 708000.00, 0.00, 'posted', NULL, '2026-11-10 05:08:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20261019-9094-1\", \"sub_order_id\": 95}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-10 05:08:02', '2026-11-10 05:08:02', NULL),
(33, 96, '777afe4c-4837-d716-a13c-846e9cd8cd7a', 'INC-20261110081202-D7F23', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20261018-9095-1', 'Order product Dompet Kartu Slim Navy x1, Jaket Hiking Softshell Abu x2, Jaket Kanvas Kerja Cokelat x1 dengan jumlah 4 nomor order FKU-20261018-9095', 1546000.00, 0.00, 'posted', NULL, '2026-11-10 01:12:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20261018-9095-1\", \"sub_order_id\": 96}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-10 01:12:02', '2026-11-10 01:12:02', NULL),
(34, 97, 'abe56782-bb24-c759-25f7-e09751e8d336', 'INC-20261110041602-29F47', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20261017-9096-1', 'Order product Jaket Kanvas Kerja Cokelat x2 dengan jumlah 2 nomor order FKU-20261017-9096', 858000.00, 0.00, 'posted', NULL, '2026-11-09 21:16:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20261017-9096-1\", \"sub_order_id\": 97}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-09 21:16:02', '2026-11-09 21:16:02', NULL),
(35, 98, 'c323571d-d64c-f97c-2808-140d3610f2eb', 'INC-20261110002102-7BF21', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20261016-9097-1', 'Order product Jaket Kanvas Kerja Cokelat x1, Jaket Kanvas Kerja Cokelat x1 dengan jumlah 2 nomor order FKU-20261016-9097', 858000.00, 0.00, 'posted', NULL, '2026-11-09 17:21:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20261016-9097-1\", \"sub_order_id\": 98}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-09 17:21:02', '2026-11-09 17:21:02', NULL),
(36, 99, '89a52d76-3cfc-c24c-cb98-21a4a56adbda', 'INC-20261109202502-CC933', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20261015-9098-1', 'Order product Jaket Harrington Cotton Navy x1, Jaket Harrington Cotton Navy x2, Dress Midi Linen Krem x1 dengan jumlah 4 nomor order FKU-20261015-9098', 1236000.00, 0.00, 'posted', NULL, '2026-11-09 13:25:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20261015-9098-1\", \"sub_order_id\": 99}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-09 13:25:02', '2026-11-09 13:25:02', NULL),
(37, 100, 'c9858af3-80a2-1b07-293a-da94c650ac94', 'INC-20261109162902-4ABDC', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20261014-9099-1', 'Order product Jaket Harrington Cotton Navy x2 dengan jumlah 2 nomor order FKU-20261014-9099', 638000.00, 0.00, 'posted', NULL, '2026-11-09 09:29:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20261014-9099-1\", \"sub_order_id\": 100}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-09 09:29:02', '2026-11-09 09:29:02', NULL),
(38, 101, '37fcb800-49bf-9dbf-c867-fc9d233699c1', 'INC-20261109123402-9BDBE', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20261012-9100-1', 'Order product Celana Chino Slim Fit Khaki x1, Celana Cargo Ripstop Olive x1 dengan jumlah 2 nomor order FKU-20261012-9100', 498000.00, 0.00, 'posted', NULL, '2026-11-09 05:34:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20261012-9100-1\", \"sub_order_id\": 101}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-09 05:34:02', '2026-11-09 05:34:02', NULL),
(39, 102, '01e1e35a-187c-d961-58ca-25d230056614', 'INC-20261109083802-F06A6', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20261011-9101-1', 'Order product Celana Chino Slim Fit Khaki x1, Celana Panjang Kanvas Cokelat x2, Blus Crop Boxy Cotton Pink x1 dengan jumlah 4 nomor order FKU-20261011-9101', 896000.00, 0.00, 'posted', NULL, '2026-11-09 01:38:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20261011-9101-1\", \"sub_order_id\": 102}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-09 01:38:02', '2026-11-09 01:38:02', NULL),
(40, 103, 'adae9f8e-378d-b2a2-3122-70eb31a99996', 'INC-20261109044202-1EA11', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20261010-9102-1', 'Order product Celana Jeans Straight Leg Indigo x2 dengan jumlah 2 nomor order FKU-20261010-9102', 658000.00, 0.00, 'posted', NULL, '2026-11-08 21:42:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20261010-9102-1\", \"sub_order_id\": 103}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-08 21:42:02', '2026-11-08 21:42:02', NULL),
(41, 104, '20d503c5-6e99-eb51-0cbd-2725f7e2e876', 'INC-20261109004702-E3139', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20261009-9103-1', 'Order product Celana Jeans Straight Leg Indigo x1, Dress Sundress Tiered Gingham x1 dengan jumlah 2 nomor order FKU-20261009-9103', 528000.00, 0.00, 'posted', NULL, '2026-11-08 17:47:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20261009-9103-1\", \"sub_order_id\": 104}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-08 17:47:02', '2026-11-08 17:47:02', NULL),
(42, 105, 'dc41400c-122c-90f0-d943-48a55f6f9abd', 'INC-20261108205102-00BD9', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20261008-9104-1', 'Order product Celana Formal Wool Blend Hitam x1, Blus Kerah Peter Pan Putih x2, Blazer Oversized Linen Oat x1 dengan jumlah 4 nomor order FKU-20261008-9104', 1256000.00, 0.00, 'posted', NULL, '2026-11-08 13:51:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20261008-9104-1\", \"sub_order_id\": 105}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-08 13:51:02', '2026-11-08 13:51:02', NULL),
(43, 106, '0fa38f39-7c4b-b50a-4de5-5843c793c295', 'INC-20261108165502-A0EB1', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20261007-9105-1', 'Order product Celana Jeans Slim Stretch Black x2 dengan jumlah 2 nomor order FKU-20261007-9105', 578000.00, 0.00, 'posted', NULL, '2026-11-08 09:55:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20261007-9105-1\", \"sub_order_id\": 106}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-08 09:55:02', '2026-11-08 09:55:02', NULL),
(44, 107, '847439d3-e0dd-ae2f-0ee8-9a07860386bd', 'INC-20261108130002-CD141', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20261006-9106-1', 'Order product Dress Shirt Midi Denim Light x1, Rok Plisket Midi Hitam x1 dengan jumlah 2 nomor order FKU-20261006-9106', 538000.00, 0.00, 'posted', NULL, '2026-11-08 06:00:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20261006-9106-1\", \"sub_order_id\": 107}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-08 06:00:02', '2026-11-08 06:00:02', NULL),
(45, 108, '0dc38b96-2c45-1fef-1143-7c08e97cf3cf', 'INC-20261108090402-E742A', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20261005-9107-1', 'Order product Dress Kemeja Midi Khaki x1, Rok Linen Panjang Sage x2, Boots Chelsea Kulit Cokelat x1 dengan jumlah 4 nomor order FKU-20261005-9107', 1296000.00, 0.00, 'posted', NULL, '2026-11-08 02:04:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20261005-9107-1\", \"sub_order_id\": 108}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-08 02:04:02', '2026-11-08 02:04:02', NULL),
(46, 110, 'd1158e10-1fb5-8d0b-7ab2-b5ad00354462', 'INC-20261108011302-F2014', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20261003-9109-1', 'Order product Blus Knit Cropped Cream x1, Sneakers Chunky Retro Silver x1 dengan jumlah 2 nomor order FKU-20261003-9109', 638000.00, 0.00, 'posted', NULL, '2026-11-07 18:13:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20261003-9109-1\", \"sub_order_id\": 110}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-07 18:13:02', '2026-11-07 18:13:02', NULL),
(47, 111, 'fb358165-f121-342b-620b-53a635217b97', 'INC-20261107211702-1B867', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20261002-9110-1', 'Order product Rok Denim A-Line Mid Blue x1, Loafers Kulit Sintetis Cokelat x2, Sandal Slide Puffy Hitam x1 dengan jumlah 4 nomor order FKU-20261002-9110', 1146000.00, 0.00, 'posted', NULL, '2026-11-07 14:17:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20261002-9110-1\", \"sub_order_id\": 111}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-07 14:17:02', '2026-11-07 14:17:02', NULL),
(48, 112, 'c5d9f141-2619-5ce4-055c-a13b1b030640', 'INC-20261107172102-733D9', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20260930-9111-1', 'Order product Blazer Oversized Linen Oat x2 dengan jumlah 2 nomor order FKU-20260930-9111', 718000.00, 0.00, 'posted', NULL, '2026-11-07 10:21:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20260930-9111-1\", \"sub_order_id\": 112}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-07 10:21:02', '2026-11-07 10:21:02', NULL),
(49, 113, '8f90ee9c-9303-a25d-6d77-f711e7ef84e6', 'INC-20261107132602-DCC18', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20260929-9112-1', 'Order product Bomber Satin Wanita Sage x1, Heels Blok Tali Hitam x1 dengan jumlah 2 nomor order FKU-20260929-9112', 708000.00, 0.00, 'posted', NULL, '2026-11-07 06:26:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20260929-9112-1\", \"sub_order_id\": 113}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-07 06:26:02', '2026-11-07 06:26:02', NULL),
(50, 114, '4fe4a5a9-ca82-3950-aa71-8f06a919f0bf', 'INC-20261107093002-CC886', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20260928-9113-1', 'Order product Sepatu Kulit Formal Oxford Hitam x1, Pantofel Wanita Nude x2, Dress Midi Linen Krem x1 dengan jumlah 4 nomor order FKU-20260928-9113', 1526000.00, 0.00, 'posted', NULL, '2026-11-07 02:30:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20260928-9113-1\", \"sub_order_id\": 114}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-07 02:30:02', '2026-11-07 02:30:02', NULL),
(51, 115, '97cec183-eea2-5e70-1751-2819621fdbf2', 'INC-20261107053502-9691B', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20260927-9114-1', 'Order product Pantofel Kulit Asli Navy x2 dengan jumlah 2 nomor order FKU-20260927-9114', 1298000.00, 0.00, 'posted', NULL, '2026-11-06 22:35:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20260927-9114-1\", \"sub_order_id\": 115}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-06 22:35:02', '2026-11-06 22:35:02', NULL),
(52, 116, '4920f24e-514f-e2cd-08c0-3adf50220e53', 'INC-20261107013902-8CAE4', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20260926-9115-1', 'Order product Sneakers Running Knit Abu x1, Tas Selempang Kulit Cokelat x1 dengan jumlah 2 nomor order FKU-20260926-9115', 838000.00, 0.00, 'posted', NULL, '2026-11-06 18:39:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20260926-9115-1\", \"sub_order_id\": 116}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-06 18:39:02', '2026-11-06 18:39:02', NULL),
(53, 117, 'be1f7f6c-786f-886f-70fd-1adf76c06110', 'INC-20261106214302-6E705', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20260925-9116-1', 'Order product Sneakers Slip-On Denim x1, Kacamata Bulat Frame Emas x2, Dress Slip Satin Champagne x1 dengan jumlah 4 nomor order FKU-20260925-9116', 1276000.00, 0.00, 'posted', NULL, '2026-11-06 14:43:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20260925-9116-1\", \"sub_order_id\": 117}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-06 14:43:02', '2026-11-06 14:43:02', NULL),
(54, 118, '83fcef72-cc4f-747a-ee98-7ca1bbda04f9', 'INC-20261106174802-E462D', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20260924-9117-1', 'Order product Sandal Slide Puffy Hitam x2 dengan jumlah 2 nomor order FKU-20260924-9117', 238000.00, 0.00, 'posted', NULL, '2026-11-06 10:48:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20260924-9117-1\", \"sub_order_id\": 118}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-06 10:48:02', '2026-11-06 10:48:02', NULL),
(55, 119, '8234251c-184e-4d14-e02b-63b6b5869842', 'INC-20261106135202-49FDB', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20260923-9118-1', 'Order product Sandal Sport Outdoor Abu x1, Dress Shirt Midi Denim Light x1 dengan jumlah 2 nomor order FKU-20260923-9118', 598000.00, 0.00, 'posted', NULL, '2026-11-06 06:52:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20260923-9118-1\", \"sub_order_id\": 119}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-06 06:52:02', '2026-11-06 06:52:02', NULL),
(56, 120, 'dcf53c7b-7960-20e7-e37b-ce04efcd9d31', 'INC-20261106095602-F70FB', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20260922-9119-1', 'Order product Dompet Kartu Slim Navy x1, Dress Shirt Midi Denim Light x2, Dress Shirt Midi Denim Light x1 dengan jumlah 4 nomor order FKU-20260922-9119', 1166000.00, 0.00, 'posted', NULL, '2026-11-06 02:56:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20260922-9119-1\", \"sub_order_id\": 120}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-06 02:56:02', '2026-11-06 02:56:02', NULL),
(57, 121, '8769c09a-cfd0-0292-f0c8-30b58bf4f1d5', 'INC-20261106060102-5558B', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20260921-9120-1', 'Order product Dress Maxi Katun Batik Parang x2 dengan jumlah 2 nomor order FKU-20260921-9120', 718000.00, 0.00, 'posted', NULL, '2026-11-05 23:01:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20260921-9120-1\", \"sub_order_id\": 121}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-05 23:01:02', '2026-11-05 23:01:02', NULL),
(58, 122, '331429a9-ba63-a268-3e5d-49912a26b5df', 'INC-20261106020502-D20E9', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20260920-9121-1', 'Order product Dress Maxi Katun Batik Parang x1, Dress Maxi Katun Batik Parang x1 dengan jumlah 2 nomor order FKU-20260920-9121', 718000.00, 0.00, 'posted', NULL, '2026-11-05 19:05:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20260920-9121-1\", \"sub_order_id\": 122}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-05 19:05:02', '2026-11-05 19:05:02', NULL),
(59, 123, '03d879fa-ea37-16e7-0382-d9e05bce0ea0', 'INC-20261105220902-3882A', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20260918-9122-1', 'Order product Dress Sundress Tiered Gingham x1, Dress Sundress Tiered Gingham x2, Dress Sundress Tiered Gingham x1 dengan jumlah 4 nomor order FKU-20260918-9122', 796000.00, 0.00, 'posted', NULL, '2026-11-05 15:09:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20260918-9122-1\", \"sub_order_id\": 123}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-05 15:09:02', '2026-11-05 15:09:02', NULL),
(60, 124, 'ab398d16-9f7d-2929-aa2b-13f81d78d085', 'INC-20261105181402-2287D', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20260917-9123-1', 'Order product Dress Sundress Tiered Gingham x2 dengan jumlah 2 nomor order FKU-20260917-9123', 398000.00, 0.00, 'posted', NULL, '2026-11-05 11:14:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20260917-9123-1\", \"sub_order_id\": 124}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-05 11:14:02', '2026-11-05 11:14:02', NULL),
(61, 125, 'dcaf3e0f-c3e0-3dd6-e158-cca1ec2560ad', 'INC-20261105141802-2207F', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20260916-9124-1', 'Order product Dress Sundress Tiered Gingham x1, Dress Sundress Tiered Gingham x1 dengan jumlah 2 nomor order FKU-20260916-9124', 398000.00, 0.00, 'posted', NULL, '2026-11-05 07:18:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20260916-9124-1\", \"sub_order_id\": 125}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-05 07:18:02', '2026-11-05 07:18:02', NULL),
(62, 126, 'a59b13c6-da0d-cc36-aa08-7fdb038f3e7a', 'INC-20261105102202-AFEA1', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20260915-9125-1', 'Order product Dress Sundress Tiered Gingham x1, Dress Sundress Tiered Gingham x2, Blus Crop Boxy Cotton Pink x1 dengan jumlah 4 nomor order FKU-20260915-9125', 736000.00, 0.00, 'posted', NULL, '2026-11-05 03:22:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20260915-9125-1\", \"sub_order_id\": 126}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-05 03:22:02', '2026-11-05 03:22:02', NULL),
(63, 127, 'b430a205-e6c4-f1a2-dd01-89b5c8728d3f', 'INC-20261105062702-9A775', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20260914-9126-1', 'Order product Dress Kemeja Midi Khaki x2 dengan jumlah 2 nomor order FKU-20260914-9126', 638000.00, 0.00, 'posted', NULL, '2026-11-04 23:27:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20260914-9126-1\", \"sub_order_id\": 127}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-04 23:27:02', '2026-11-04 23:27:02', NULL),
(64, 128, '32dc5cb6-dfa4-d861-17b7-16128391058c', 'INC-20261105023102-2BC00', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20260913-9127-1', 'Order product Dress Off Shoulder Ruffle Terracotta x1, Dress Off Shoulder Ruffle Terracotta x1 dengan jumlah 2 nomor order FKU-20260913-9127', 518000.00, 0.00, 'posted', NULL, '2026-11-04 19:31:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20260913-9127-1\", \"sub_order_id\": 128}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-04 19:31:02', '2026-11-04 19:31:02', NULL),
(65, 129, 'eb50c71c-58bf-77e2-f3b9-920c25108c95', 'INC-20261104223502-6D212', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20260912-9128-1', 'Order product Dress Off Shoulder Ruffle Terracotta x1, Blus Kerah Peter Pan Putih x2, Blazer Oversized Linen Oat x1 dengan jumlah 4 nomor order FKU-20260912-9128', 1056000.00, 0.00, 'posted', NULL, '2026-11-04 15:35:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20260912-9128-1\", \"sub_order_id\": 129}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-04 15:35:02', '2026-11-04 15:35:02', NULL),
(66, 130, 'b1bd0bd7-5142-a51a-9155-576acb2bc84e', 'INC-20261104184002-3420E', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20260911-9129-1', 'Order product Blus Ruffle Satin Ivory x2 dengan jumlah 2 nomor order FKU-20260911-9129', 418000.00, 0.00, 'posted', NULL, '2026-11-04 11:40:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20260911-9129-1\", \"sub_order_id\": 130}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-04 11:40:02', '2026-11-04 11:40:02', NULL),
(67, 131, 'dd1ecb58-65a6-92bf-dd73-2f17941c977b', 'INC-20261104144402-A0B8D', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20260910-9130-1', 'Order product Blus Ruffle Satin Ivory x1, Rok Plisket Midi Hitam x1 dengan jumlah 2 nomor order FKU-20260910-9130', 398000.00, 0.00, 'posted', NULL, '2026-11-04 07:44:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20260910-9130-1\", \"sub_order_id\": 131}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-04 07:44:02', '2026-11-04 07:44:02', NULL),
(68, 132, '3509673a-1d35-b0b9-594c-ff9f3e19b2a9', 'INC-20261104104802-6413E', 'income', 'penjualan', 'Pemasukan sesuai dengan no order FKU-20260909-9131-1', 'Order product Blus Kerah Peter Pan Putih x1, Rok Linen Panjang Sage x2, Boots Chelsea Kulit Cokelat x1 dengan jumlah 4 nomor order FKU-20260909-9131', 1196000.00, 0.00, 'posted', NULL, '2026-11-04 03:48:02', NULL, 1, '{\"source\": \"order_completed\", \"order_number\": \"FKU-20260909-9131-1\", \"sub_order_id\": 132}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-04 03:48:02', '2026-11-04 03:48:02', NULL),
(69, NULL, NULL, 'EXP-20261114-001', 'expense', 'marketing', 'Iklan Meta Ads minggu ini', 'Pengeluaran operasional toko: Iklan Meta Ads minggu ini', 1850000.00, 1850000.00, 'posted', NULL, '2026-11-13 03:00:00', '2026-11-13 03:00:00', 1, '{\"source\": \"manual_entry\"}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-13 03:00:00', '2026-11-13 03:00:00', NULL),
(70, NULL, NULL, 'EXP-20261114-002', 'expense', 'marketing', 'Iklan TikTok & affiliate', 'Pengeluaran operasional toko: Iklan TikTok & affiliate', 1275000.00, 1275000.00, 'posted', NULL, '2026-11-11 04:11:00', '2026-11-11 04:11:00', 1, '{\"source\": \"manual_entry\"}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-11 04:11:00', '2026-11-11 04:11:00', NULL),
(71, NULL, NULL, 'EXP-20261114-003', 'expense', 'logistik', 'Subsidi ongkir promo gratis ongkir', 'Pengeluaran operasional toko: Subsidi ongkir promo gratis ongkir', 480000.00, 480000.00, 'posted', NULL, '2026-11-14 05:22:00', '2026-11-14 05:22:00', 1, '{\"source\": \"manual_entry\"}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 05:22:00', '2026-11-14 05:22:00', NULL),
(72, NULL, NULL, 'EXP-20261114-004', 'expense', 'operasional', 'Packing, bubble wrap & lakban', 'Pengeluaran operasional toko: Packing, bubble wrap & lakban', 640000.00, 640000.00, 'posted', NULL, '2026-11-12 06:33:00', '2026-11-12 06:33:00', 1, '{\"source\": \"manual_entry\"}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-12 06:33:00', '2026-11-12 06:33:00', NULL),
(73, NULL, NULL, 'EXP-20261114-005', 'expense', 'operasional', 'Sewa gudang bulanan', 'Pengeluaran operasional toko: Sewa gudang bulanan', 3500000.00, 3500000.00, 'posted', NULL, '2026-11-02 07:44:00', '2026-11-02 07:44:00', 1, '{\"source\": \"manual_entry\"}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-02 07:44:00', '2026-11-02 07:44:00', NULL),
(74, NULL, NULL, 'EXP-20261114-006', 'expense', 'gaji', 'Gaji admin, packing & CS', 'Pengeluaran operasional toko: Gaji admin, packing & CS', 8400000.00, 8400000.00, 'posted', NULL, '2026-11-09 08:55:00', '2026-11-09 08:55:00', 1, '{\"source\": \"manual_entry\"}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-09 08:55:00', '2026-11-09 08:55:00', NULL),
(75, NULL, NULL, 'EXP-20261114-007', 'expense', 'operasional', 'Listrik, air & internet gudang', 'Pengeluaran operasional toko: Listrik, air & internet gudang', 1150000.00, 1150000.00, 'posted', NULL, '2026-11-06 09:06:00', '2026-11-06 09:06:00', 1, '{\"source\": \"manual_entry\"}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-06 09:06:00', '2026-11-06 09:06:00', NULL),
(76, NULL, NULL, 'EXP-20261114-008', 'expense', 'logistik', 'Pickup kurir & retur barang', 'Pengeluaran operasional toko: Pickup kurir & retur barang', 325000.00, 325000.00, 'posted', NULL, '2026-11-08 10:17:00', '2026-11-08 10:17:00', 1, '{\"source\": \"manual_entry\"}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-08 10:17:00', '2026-11-08 10:17:00', NULL),
(77, NULL, NULL, 'EXP-20261114-009', 'expense', 'marketing', 'Foto produk & sewa studio', 'Pengeluaran operasional toko: Foto produk & sewa studio', 1500000.00, 1500000.00, 'posted', NULL, '2026-10-31 03:28:00', '2026-10-31 03:28:00', 1, '{\"source\": \"manual_entry\"}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-31 03:28:00', '2026-10-31 03:28:00', NULL),
(78, NULL, NULL, 'EXP-20261114-010', 'expense', 'operasional', 'ATK, kertas invoice & label', 'Pengeluaran operasional toko: ATK, kertas invoice & label', 215000.00, 215000.00, 'posted', NULL, '2026-10-27 04:39:00', '2026-10-27 04:39:00', 1, '{\"source\": \"manual_entry\"}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-27 04:39:00', '2026-10-27 04:39:00', NULL),
(79, NULL, NULL, 'EXP-20261114-011', 'expense', 'operasional', 'Servis mesin jahit', 'Pengeluaran operasional toko: Servis mesin jahit', 475000.00, 475000.00, 'posted', NULL, '2026-10-24 05:50:00', '2026-10-24 05:50:00', 1, '{\"source\": \"manual_entry\"}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-24 05:50:00', '2026-10-24 05:50:00', NULL),
(80, NULL, NULL, 'EXP-20261114-012', 'expense', 'marketing', 'Giveaway & sample KOL', 'Pengeluaran operasional toko: Giveaway & sample KOL', 900000.00, 900000.00, 'posted', NULL, '2026-10-20 06:01:00', '2026-10-20 06:01:00', 1, '{\"source\": \"manual_entry\"}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-20 06:01:00', '2026-10-20 06:01:00', NULL),
(81, NULL, NULL, 'EXP-20261114-013', 'expense', 'operasional', 'Konsumsi tim packing', 'Pengeluaran operasional toko: Konsumsi tim packing', 300000.00, 300000.00, 'posted', NULL, '2026-10-15 07:12:00', '2026-10-15 07:12:00', 1, '{\"source\": \"manual_entry\"}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-15 07:12:00', '2026-10-15 07:12:00', NULL),
(82, NULL, NULL, 'EXP-20261114-014', 'expense', 'logistik', 'Ongkir retur pelanggan', 'Pengeluaran operasional toko: Ongkir retur pelanggan', 180000.00, 180000.00, 'posted', NULL, '2026-10-10 08:23:00', '2026-10-10 08:23:00', 1, '{\"source\": \"manual_entry\"}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-10 08:23:00', '2026-10-10 08:23:00', NULL),
(83, NULL, NULL, 'PAY-20261114-001', 'payable', 'supplier', 'Inv supplier katun combed 24s & 30s', 'Tagihan supplier, termin pembayaran jatuh tempo 3 hari lagi', 12400000.00, 6000000.00, 'open', '2026-11-17', '2026-10-25 04:00:00', NULL, 1, '{\"payment_term\": \"net-30\", \"payment_label\": \"partial\"}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-25 04:00:00', '2026-11-14 02:24:37', NULL),
(84, NULL, NULL, 'PAY-20261114-002', 'payable', 'supplier', 'Inv konveksi jahit batch Desember', 'Tagihan supplier, termin pembayaran jatuh tempo 7 hari lagi', 8750000.00, 0.00, 'open', '2026-11-21', '2026-10-28 04:00:00', NULL, 1, '{\"payment_term\": \"net-30\", \"payment_label\": \"unpaid\"}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-28 04:00:00', '2026-11-14 02:24:37', NULL),
(85, NULL, NULL, 'PAY-20261114-003', 'payable', 'supplier', 'Inv supplier box & label packaging', 'Tagihan supplier, termin pembayaran sudah lewat jatuh tempo', 2100000.00, 2100000.00, 'paid', '2026-11-12', '2026-10-31 04:00:00', '2026-11-12 02:24:37', 1, '{\"payment_term\": \"net-30\", \"payment_label\": \"paid\"}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-31 04:00:00', '2026-11-14 02:24:37', NULL),
(86, NULL, NULL, 'PAY-20261114-004', 'payable', 'supplier', 'Inv import sepatu & tas (termin 2)', 'Tagihan supplier, termin pembayaran sudah lewat jatuh tempo', 15000000.00, 5000000.00, 'open', '2026-11-13', '2026-11-03 04:00:00', NULL, 1, '{\"payment_term\": \"net-30\", \"payment_label\": \"partial\"}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-03 04:00:00', '2026-11-14 02:24:37', NULL),
(87, NULL, NULL, 'RCV-20261114-001', 'receivable', 'penjualan', 'Pencairan dana marketplace (Shopee & TikTok)', 'Piutang penjualan yang belum cair', 6250000.00, 0.00, 'open', '2026-11-16', '2026-11-08 02:30:00', NULL, 1, '{\"source\": \"sales\"}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-08 02:30:00', '2026-11-14 02:24:37', NULL),
(88, NULL, NULL, 'RCV-20261114-002', 'receivable', 'penjualan', 'Invoice reseller Bandung — batch 24 pcs', 'Piutang penjualan yang belum cair', 3400000.00, 1700000.00, 'partial', '2026-11-19', '2026-11-10 02:30:00', NULL, 1, '{\"source\": \"sales\"}', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-10 02:30:00', '2026-11-14 02:24:37', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2026_11_14_000001_create_framework_tables', 1),
(2, '2026_11_14_000002_create_identity_tables', 1),
(3, '2026_11_14_000003_create_core_and_catalog_tables', 1),
(4, '2026_11_14_000004_create_marketing_tables', 1),
(5, '2026_11_14_000005_create_commerce_tables', 1),
(6, '2026_11_14_000006_create_inventory_tables', 1),
(7, '2026_11_14_000007_create_finance_tables', 1),
(8, '2026_11_14_000008_create_communication_tables', 1);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint UNSIGNED NOT NULL,
  `order_number` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_type` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'normal',
  `preorder_release_at` timestamp NULL DEFAULT NULL,
  `scheduled_at` timestamp NULL DEFAULT NULL,
  `received_at` timestamp NULL DEFAULT NULL,
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `voucher_id` bigint UNSIGNED DEFAULT NULL,
  `total_amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `discount_amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `shipping_discount_amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `payment_status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unpaid',
  `payment_method` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `midtrans_snap_token` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shipping_address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `order_number`, `order_type`, `preorder_release_at`, `scheduled_at`, `received_at`, `user_id`, `voucher_id`, `total_amount`, `discount_amount`, `shipping_discount_amount`, `status`, `payment_status`, `payment_method`, `midtrans_snap_token`, `shipping_address`, `created_at`, `updated_at`) VALUES
(1, 'FKU-20261114-9000', 'normal', NULL, NULL, NULL, 'abe56782-bb24-c759-25f7-e09751e8d336', NULL, 196000.00, 0.00, 0.00, 'pending', 'unpaid', 'midtrans', 'snap-f6a0021648b67205', '{\"recipient\":\"Fajar Nugroho\",\"phone\":\"08220100011\",\"address\":\"Jl. Raya Darmo No. 45, Darmo, Surabaya 60241\"}', '2026-11-14 02:20:02', '2026-11-14 02:23:02'),
(2, 'FKU-20261114-9001', 'normal', NULL, NULL, NULL, 'c323571d-d64c-f97c-2808-140d3610f2eb', NULL, 338000.00, 0.00, 0.00, 'pending', 'unpaid', 'bank_transfer', NULL, '{\"recipient\":\"Aditya Nugraha\",\"phone\":\"08590100048\",\"address\":\"Jl. Panglima Polim V No. 8, Gunung, Jakarta Selatan 12160\"}', '2026-11-14 02:13:02', '2026-11-14 02:17:02'),
(3, 'FKU-20261114-9002', 'normal', NULL, NULL, NULL, '89a52d76-3cfc-c24c-cb98-21a4a56adbda', NULL, 1386000.00, 0.00, 0.00, 'pending', 'unpaid', 'ewallet', NULL, '{\"recipient\":\"Maulana Yusuf\",\"phone\":\"08960100085\",\"address\":\"Jl. Jend. Sudirman No. 88, Pucang Kertu, Sidoarjo 61213\"}', '2026-11-14 02:05:02', '2026-11-14 02:10:02'),
(4, 'FKU-20261114-9003', 'normal', NULL, NULL, NULL, 'c9858af3-80a2-1b07-293a-da94c650ac94', NULL, 378000.00, 0.00, 0.00, 'cancelled', 'cancelled', 'qris', NULL, '{\"recipient\":\"Citra Kirana\",\"phone\":\"08370100026\",\"address\":\"Jl. Tanjung Duren Utara No. 21, Tanjung Duren, Jakarta Barat 11470\"}', '2026-11-14 01:57:02', '2026-11-14 02:11:02'),
(5, 'FKU-20261114-9004', 'normal', NULL, NULL, NULL, '37fcb800-49bf-9dbf-c867-fc9d233699c1', NULL, 648000.00, 0.00, 0.00, 'pending', 'unpaid', 'midtrans', 'snap-0711c3b5d0be9765', '{\"recipient\":\"Putra Mahendra\",\"phone\":\"08740100063\",\"address\":\"Jl. Raya Ubud No. 15, Ubud, Gianyar 80571\"}', '2026-11-14 01:46:02', '2026-11-14 01:53:02'),
(6, 'FKU-20261114-9005', 'normal', NULL, NULL, NULL, '01e1e35a-187c-d961-58ca-25d230056614', NULL, 1026000.00, 0.00, 0.00, 'pending', 'unpaid', 'bank_transfer', NULL, '{\"recipient\":\"Nadia Kusuma\",\"phone\":\"08150100004\",\"address\":\"Jl. Dr. Setiabudi No. 210, Pasteur, Bandung 40161\"}', '2026-11-14 01:32:02', '2026-11-14 01:40:02'),
(7, 'FKU-20261114-9006', 'normal', NULL, NULL, NULL, 'adae9f8e-378d-b2a2-3122-70eb31a99996', 7, 898000.00, 100000.00, 0.00, 'processing', 'paid', 'ewallet', NULL, '{\"recipient\":\"Sylvia Handoko\",\"phone\":\"08520100041\",\"address\":\"Jl. Veteran No. 66, Kemang Manis, Palembang 30131\"}', '2026-11-14 01:18:02', '2026-11-14 01:27:02'),
(8, 'FKU-20261114-9007', 'normal', NULL, NULL, NULL, '20d503c5-6e99-eb51-0cbd-2725f7e2e876', NULL, 398000.00, 0.00, 0.00, 'pending', 'unpaid', 'qris', NULL, '{\"recipient\":\"Fransiska Loi\",\"phone\":\"08890100078\",\"address\":\"Jl. Margonda Raya No. 78, Mekarsari, Depok 16411\"}', '2026-11-14 01:01:02', '2026-11-14 01:11:02'),
(9, 'FKU-20261114-9008', 'normal', NULL, NULL, NULL, 'dc41400c-122c-90f0-d943-48a55f6f9abd', NULL, 1256000.00, 0.00, 0.00, 'pending', 'unpaid', 'midtrans', 'snap-3142486c71605245', '{\"recipient\":\"Taufik Hidayat\",\"phone\":\"08300100019\",\"address\":\"Jl. Wolter Monginsidi No. 73, Kota Karang, Bandar Lampung 35116\"}', '2026-11-14 00:47:02', '2026-11-14 00:58:02'),
(10, 'FKU-20261114-9009', 'normal', NULL, NULL, NULL, '0fa38f39-7c4b-b50a-4de5-5843c793c295', NULL, 578000.00, 0.00, 0.00, 'processing', 'paid', 'bank_transfer', NULL, '{\"recipient\":\"Indra Kusuma\",\"phone\":\"08670100056\",\"address\":\"Jl. Slamet Riyadi No. 456, Sriwedari, Surakarta 57141\"}', '2026-11-14 00:29:02', '2026-11-14 00:41:02'),
(11, 'FKU-20261114-9010', 'normal', NULL, NULL, NULL, '847439d3-e0dd-ae2f-0ee8-9a07860386bd', NULL, 538000.00, 0.00, 0.00, 'pending', 'unpaid', 'ewallet', NULL, '{\"recipient\":\"Ujang Suryana\",\"phone\":\"08150100093\",\"address\":\"Jl. MT Haryono No. 55, Klandasan Ilir, Balikpapan 76112\"}', '2026-11-14 00:10:02', '2026-11-14 00:23:02'),
(12, 'FKU-20261114-9011', 'normal', NULL, NULL, NULL, '0dc38b96-2c45-1fef-1143-7c08e97cf3cf', NULL, 1296000.00, 0.00, 0.00, 'pending', 'unpaid', 'qris', NULL, '{\"recipient\":\"Larasati Dewi\",\"phone\":\"08450100034\",\"address\":\"Jl. Gejayan No. 112, Demangan, Kota Yogyakarta 55281\"}', '2026-11-13 23:48:02', '2026-11-14 00:02:02'),
(13, 'FKU-20261114-9012', 'normal', NULL, NULL, NULL, '68cea60f-963e-3cf9-2f5d-579d2cffe41b', 6, 428000.00, 30000.00, 0.00, 'processing', 'paid', 'midtrans', 'snap-09d83c399f663270', '{\"recipient\":\"Yusril Hakim\",\"phone\":\"08820100071\",\"address\":\"Jl. Tgk. Chik Ditiro No. 61, Kupiah, Banda Aceh 23352\"}', '2026-11-13 23:19:02', '2026-11-13 23:34:02'),
(14, 'FKU-20261114-9013', 'normal', NULL, NULL, NULL, 'd1158e10-1fb5-8d0b-7ab2-b5ad00354462', NULL, 638000.00, 0.00, 0.00, 'processing', 'paid', 'bank_transfer', NULL, '{\"recipient\":\"Intan Permata\",\"phone\":\"08230100012\",\"address\":\"Jl. Basuki Rahmat No. 29, Klojen, Malang 65112\"}', '2026-11-13 22:44:02', '2026-11-13 23:00:02'),
(15, 'FKU-20261114-9014', 'normal', NULL, NULL, NULL, 'fb358165-f121-342b-620b-53a635217b97', NULL, 1146000.00, 0.00, 0.00, 'processing', 'paid', 'ewallet', NULL, '{\"recipient\":\"Bella Anindita\",\"phone\":\"08600100049\",\"address\":\"Jl. Cikini Raya No. 45, Cikini, Jakarta Pusat 10330\"}', '2026-11-13 21:59:02', '2026-11-13 22:16:02'),
(16, 'FKU-20261114-9015', 'normal', NULL, NULL, NULL, 'c5d9f141-2619-5ce4-055c-a13b1b030640', NULL, 718000.00, 0.00, 0.00, 'shipped', 'paid', 'qris', NULL, '{\"recipient\":\"Novi Andriani\",\"phone\":\"08970100086\",\"address\":\"Jl. Danau Tamblingan No. 22, Sanur, Denpasar 80228\"}', '2026-11-13 21:14:02', '2026-11-13 23:34:02'),
(17, 'FKU-20261114-9016', 'normal', NULL, NULL, NULL, '8f90ee9c-9303-a25d-6d77-f711e7ef84e6', NULL, 708000.00, 0.00, 0.00, 'processing', 'paid', 'midtrans', 'snap-249e9f06807e3818', '{\"recipient\":\"Donny Saputra\",\"phone\":\"08380100027\",\"address\":\"Jl. Cipaganti No. 87, Cipaganti, Bandung 40131\"}', '2026-11-13 20:24:02', '2026-11-13 20:43:02'),
(18, 'FKU-20261114-9017', 'normal', NULL, NULL, NULL, '4fe4a5a9-ca82-3950-aa71-8f06a919f0bf', NULL, 1376000.00, 0.00, 0.00, 'processing', 'paid', 'bank_transfer', NULL, '{\"recipient\":\"Qori Amalia\",\"phone\":\"08750100064\",\"address\":\"Jl. Gatot Subroto No. 301, Sedayu, Medan 20123\"}', '2026-11-13 19:29:02', '2026-11-13 19:49:02'),
(19, 'FKU-20261114-9018', 'normal', NULL, NULL, NULL, '97cec183-eea2-5e70-1751-2819621fdbf2', 3, 1223000.00, 75000.00, 0.00, 'processing', 'paid', 'ewallet', NULL, '{\"recipient\":\"Rizky Pratama\",\"phone\":\"08160100005\",\"address\":\"Jl. Ahmad Yani No. 12, Jaka Mulya, Bekasi 17146\"}', '2026-11-13 18:34:02', '2026-11-13 18:55:02'),
(20, 'FKU-20261114-9019', 'normal', NULL, NULL, NULL, '4920f24e-514f-e2cd-08c0-3adf50220e53', NULL, 838000.00, 0.00, 0.00, 'processing', 'paid', 'qris', NULL, '{\"recipient\":\"Tegar Afandi\",\"phone\":\"08530100042\",\"address\":\"Jl. Soekarno Hatta No. 141, Harjosari, Pekanbaru 28292\"}', '2026-11-13 17:24:02', '2026-11-13 17:46:02'),
(21, 'FKU-20261113-9020', 'normal', NULL, NULL, '2026-11-13 23:21:02', 'be1f7f6c-786f-886f-70fd-1adf76c06110', NULL, 1246000.00, 0.00, 0.00, 'received', 'paid', 'midtrans', 'snap-e05799c09cbb58dc', '{\"recipient\":\"Gading Martadinata\",\"phone\":\"08900100079\",\"address\":\"Jl. Pandanaran No. 34, Bendungan, Semarang 50231\"}', '2026-11-13 16:14:02', '2026-11-13 23:21:02'),
(22, 'FKU-20261113-9021', 'normal', NULL, NULL, NULL, '83fcef72-cc4f-747a-ee98-7ca1bbda04f9', NULL, 262000.00, 0.00, 0.00, 'shipped', 'paid', 'bank_transfer', NULL, '{\"recipient\":\"Nabila Syakira\",\"phone\":\"08310100020\",\"address\":\"Jl. Boulevard No. 18, Karama, Makassar 90231\"}', '2026-11-13 14:54:02', '2026-11-13 20:05:02'),
(23, 'FKU-20261113-9022', 'normal', NULL, NULL, NULL, '8234251c-184e-4d14-e02b-63b6b5869842', NULL, 418000.00, 0.00, 0.00, 'shipped', 'paid', 'ewallet', NULL, '{\"recipient\":\"Jihan Aurelia\",\"phone\":\"08680100057\",\"address\":\"Jl. Kaliurang KM 6 No. 19, Caturtunggal, Sleman 55281\"}', '2026-11-13 13:24:02', '2026-11-13 19:15:02'),
(24, 'FKU-20261113-9023', 'normal', NULL, NULL, NULL, 'dcf53c7b-7960-20e7-e37b-ce04efcd9d31', NULL, 706000.00, 0.00, 0.00, 'shipped', 'paid', 'qris', NULL, '{\"recipient\":\"Vera Marlina\",\"phone\":\"08160100094\",\"address\":\"Jl. Pejanggik No. 9, Pejanggik, Mataram 83117\"}', '2026-11-13 11:54:02', '2026-11-13 18:26:02'),
(25, 'FKU-20261113-9024', 'normal', NULL, NULL, '2026-11-13 21:36:02', '8769c09a-cfd0-0292-f0c8-30b58bf4f1d5', 1, 255000.00, 25000.00, 0.00, 'received', 'paid', 'midtrans', 'snap-a97388061785bdce', '{\"recipient\":\"Muhammad Rizki\",\"phone\":\"08460100035\",\"address\":\"Jl. Raya Darmo No. 45, Darmo, Surabaya 60241\"}', '2026-11-13 10:24:02', '2026-11-13 21:36:02'),
(26, 'FKU-20261113-9025', 'normal', NULL, NULL, NULL, '331429a9-ba63-a268-3e5d-49912a26b5df', NULL, 308000.00, 0.00, 0.00, 'shipped', 'paid', 'bank_transfer', NULL, '{\"recipient\":\"Zaskia Mecca\",\"phone\":\"08830100072\",\"address\":\"Jl. Panglima Polim V No. 8, Gunung, Jakarta Selatan 12160\"}', '2026-11-13 08:24:02', '2026-11-13 16:30:02'),
(27, 'FKU-20261113-9026', 'normal', NULL, NULL, NULL, '03d879fa-ea37-16e7-0382-d9e05bce0ea0', NULL, 1386000.00, 0.00, 0.00, 'shipped', 'paid', 'ewallet', NULL, '{\"recipient\":\"Reza Fahlevi\",\"phone\":\"08240100013\",\"address\":\"Jl. Jend. Sudirman No. 88, Pucang Kertu, Sidoarjo 61213\"}', '2026-11-13 06:24:02', '2026-11-13 15:24:02'),
(28, 'FKU-20261113-9027', 'normal', NULL, NULL, NULL, 'ab398d16-9f7d-2929-aa2b-13f81d78d085', NULL, 378000.00, 0.00, 0.00, 'shipped', 'paid', 'qris', NULL, '{\"recipient\":\"Chandra Wijaya\",\"phone\":\"08610100050\",\"address\":\"Jl. Tanjung Duren Utara No. 21, Tanjung Duren, Jakarta Barat 11470\"}', '2026-11-13 04:24:02', '2026-11-13 14:18:02'),
(29, 'FKU-20261113-9028', 'normal', NULL, NULL, NULL, 'dcaf3e0f-c3e0-3dd6-e158-cca1ec2560ad', NULL, 648000.00, 0.00, 0.00, 'shipped', 'paid', 'midtrans', 'snap-09383b21c8458a3f', '{\"recipient\":\"Opan Sofyan\",\"phone\":\"08980100087\",\"address\":\"Jl. Raya Ubud No. 15, Ubud, Gianyar 80571\"}', '2026-11-13 02:24:02', '2026-11-13 13:12:02'),
(30, 'FKU-20261113-9029', 'normal', NULL, NULL, NULL, 'a59b13c6-da0d-cc36-aa08-7fdb038f3e7a', NULL, 1026000.00, 0.00, 0.00, 'shipped', 'paid', 'bank_transfer', NULL, '{\"recipient\":\"Eka Puspita\",\"phone\":\"08390100028\",\"address\":\"Jl. Dr. Setiabudi No. 210, Pasteur, Bandung 40161\"}', '2026-11-13 00:07:02', '2026-11-13 11:57:02'),
(31, 'FKU-20261113-9030', 'normal', NULL, NULL, '2026-11-13 17:50:02', 'b430a205-e6c4-f1a2-dd01-89b5c8728d3f', 7, 898000.00, 100000.00, 0.00, 'received', 'paid', 'ewallet', NULL, '{\"recipient\":\"Rian Adinata\",\"phone\":\"08760100065\",\"address\":\"Jl. Veteran No. 66, Kemang Manis, Palembang 30131\"}', '2026-11-12 21:50:02', '2026-11-13 17:50:02'),
(32, 'FKU-20261113-9031', 'normal', NULL, NULL, NULL, '32dc5cb6-dfa4-d861-17b7-16128391058c', NULL, 398000.00, 0.00, 0.00, 'shipped', 'paid', 'qris', NULL, '{\"recipient\":\"Fitri Handayani\",\"phone\":\"08170100006\",\"address\":\"Jl. Margonda Raya No. 78, Mekarsari, Depok 16411\"}', '2026-11-12 19:33:02', '2026-11-13 09:26:02'),
(33, 'FKU-20261113-9032', 'normal', NULL, NULL, NULL, 'eb50c71c-58bf-77e2-f3b9-920c25108c95', NULL, 1256000.00, 0.00, 0.00, 'shipped', 'paid', 'midtrans', 'snap-e6eb540cab2ac2c7', '{\"recipient\":\"Ulfa Nurlaila\",\"phone\":\"08540100043\",\"address\":\"Jl. Wolter Monginsidi No. 73, Kota Karang, Bandar Lampung 35116\"}', '2026-11-12 17:16:02', '2026-11-13 08:11:02'),
(34, 'FKU-20261112-9033', 'normal', NULL, NULL, '2026-11-13 15:47:02', 'b1bd0bd7-5142-a51a-9155-576acb2bc84e', NULL, 578000.00, 0.00, 0.00, 'received', 'paid', 'bank_transfer', NULL, '{\"recipient\":\"Hilda Yuliani\",\"phone\":\"08910100080\",\"address\":\"Jl. Slamet Riyadi No. 456, Sriwedari, Surakarta 57141\"}', '2026-11-12 14:59:02', '2026-11-13 15:47:02'),
(35, 'FKU-20261112-9034', 'normal', NULL, NULL, NULL, 'dd1ecb58-65a6-92bf-dd73-2f17941c977b', NULL, 538000.00, 0.00, 0.00, 'shipped', 'paid', 'ewallet', NULL, '{\"recipient\":\"Andi Kurniawan\",\"phone\":\"08320100021\",\"address\":\"Jl. MT Haryono No. 55, Klandasan Ilir, Balikpapan 76112\"}', '2026-11-12 12:42:02', '2026-11-13 05:40:02'),
(36, 'FKU-20261112-9035', 'normal', NULL, NULL, NULL, '3509673a-1d35-b0b9-594c-ff9f3e19b2a9', NULL, 1296000.00, 0.00, 0.00, 'shipped', 'paid', 'qris', NULL, '{\"recipient\":\"Krisna Yudha\",\"phone\":\"08690100058\",\"address\":\"Jl. Gejayan No. 112, Demangan, Kota Yogyakarta 55281\"}', '2026-11-12 10:25:02', '2026-11-13 04:25:02'),
(37, 'FKU-20261112-9036', 'normal', NULL, NULL, '2026-11-13 13:43:02', '4999ee98-9d2f-16b5-4e45-782a5cbc2e18', 2, 458000.00, 0.00, 20000.00, 'received', 'paid', 'midtrans', 'snap-1ffafd9b35a3d943', '{\"recipient\":\"Wahyu Setiawan\",\"phone\":\"08170100095\",\"address\":\"Jl. Tgk. Chik Ditiro No. 61, Kupiah, Banda Aceh 23352\"}', '2026-11-12 08:08:02', '2026-11-13 13:43:02'),
(38, 'FKU-20261112-9037', 'normal', NULL, NULL, NULL, 'fd1a4098-c0e9-2f33-f52d-b2b92cef814c', NULL, 638000.00, 0.00, 0.00, 'shipped', 'paid', 'bank_transfer', NULL, '{\"recipient\":\"Nina Marlina\",\"phone\":\"08470100036\",\"address\":\"Jl. Basuki Rahmat No. 29, Klojen, Malang 65112\"}', '2026-11-12 05:51:02', '2026-11-13 01:54:02'),
(39, 'FKU-20261112-9038', 'normal', NULL, NULL, NULL, '5570cce1-49a1-d137-3658-ff2640f2c112', NULL, 1146000.00, 0.00, 0.00, 'shipped', 'paid', 'ewallet', NULL, '{\"recipient\":\"Ahmad Fauzi\",\"phone\":\"08840100073\",\"address\":\"Jl. Cikini Raya No. 45, Cikini, Jakarta Pusat 10330\"}', '2026-11-12 03:34:02', '2026-11-13 00:39:02'),
(40, 'FKU-20261112-9039', 'normal', NULL, NULL, '2026-11-13 11:40:02', 'b4844148-08c8-975a-6f83-f4eddd7fa28a', NULL, 718000.00, 0.00, 0.00, 'received', 'paid', 'qris', NULL, '{\"recipient\":\"Putri Ayu Lestari\",\"phone\":\"08250100014\",\"address\":\"Jl. Danau Tamblingan No. 22, Sanur, Denpasar 80228\"}', '2026-11-12 01:17:02', '2026-11-13 11:40:02'),
(41, 'FKU-20261112-9040', 'normal', NULL, NULL, NULL, 'ddc8ad23-f5d1-dbc4-0919-7a0eb049e67c', NULL, 708000.00, 0.00, 0.00, 'shipped', 'paid', 'midtrans', 'snap-1084cb3074fc5dd4', '{\"recipient\":\"Dinda Larasati\",\"phone\":\"08620100051\",\"address\":\"Jl. Cipaganti No. 87, Cipaganti, Bandung 40131\"}', '2026-11-11 23:00:02', '2026-11-12 22:08:02'),
(42, 'FKU-20261112-9041', 'normal', NULL, NULL, NULL, 'dff1ab85-91bd-f4a1-f36c-a62f6c2ce82e', NULL, 1326000.00, 0.00, 0.00, 'shipped', 'paid', 'bank_transfer', NULL, '{\"recipient\":\"Puspita Ayu\",\"phone\":\"08990100088\",\"address\":\"Jl. Gatot Subroto No. 301, Sedayu, Medan 20123\"}', '2026-11-11 20:43:02', '2026-11-12 20:52:02'),
(43, 'FKU-20261112-9042', 'normal', NULL, NULL, '2026-11-13 09:37:02', 'accc1906-fb5d-6efc-24ed-0e0fb269c69e', 3, 1223000.00, 75000.00, 0.00, 'received', 'paid', 'ewallet', NULL, '{\"recipient\":\"Gilang Ramadhan\",\"phone\":\"08400100029\",\"address\":\"Jl. Ahmad Yani No. 12, Jaka Mulya, Bekasi 17146\"}', '2026-11-11 18:26:02', '2026-11-13 09:37:02'),
(44, 'FKU-20261111-9043', 'normal', NULL, NULL, NULL, '74e3c558-0560-b63b-ba00-8a01fc6af72a', NULL, 838000.00, 0.00, 0.00, 'shipped', 'paid', 'qris', NULL, '{\"recipient\":\"Sinta Dewanti\",\"phone\":\"08770100066\",\"address\":\"Jl. Soekarno Hatta No. 141, Harjosari, Pekanbaru 28292\"}', '2026-11-11 16:09:02', '2026-11-12 18:22:02'),
(45, 'FKU-20261111-9044', 'normal', NULL, NULL, NULL, 'e770f616-1223-c4da-de7b-e82721d80c40', NULL, 1246000.00, 0.00, 0.00, 'shipped', 'paid', 'midtrans', 'snap-e18fa014d1959f02', '{\"recipient\":\"Arif Setiawan\",\"phone\":\"08180100007\",\"address\":\"Jl. Pandanaran No. 34, Bendungan, Semarang 50231\"}', '2026-11-11 13:52:02', '2026-11-12 17:06:02'),
(46, 'FKU-20261111-9045', 'normal', NULL, NULL, '2026-11-13 07:33:02', '2c230d3d-c8f6-ebf9-80d8-9238d4f2941a', NULL, 256000.00, 0.00, 0.00, 'received', 'paid', 'bank_transfer', NULL, '{\"recipient\":\"Vino Bastian\",\"phone\":\"08550100044\",\"address\":\"Jl. Boulevard No. 18, Karama, Makassar 90231\"}', '2026-11-11 11:35:02', '2026-11-13 07:33:02'),
(47, 'FKU-20261111-9046', 'normal', NULL, NULL, NULL, '74266d05-6397-1296-991e-3d76c6ad9122', NULL, 328000.00, 0.00, 0.00, 'shipped', 'paid', 'ewallet', NULL, '{\"recipient\":\"Iqbal Mauludi\",\"phone\":\"08920100081\",\"address\":\"Jl. Kaliurang KM 6 No. 19, Caturtunggal, Sleman 55281\"}', '2026-11-11 09:18:02', '2026-11-12 14:36:02'),
(48, 'FKU-20261111-9047', 'normal', NULL, NULL, NULL, '266fa5bb-8cc7-149a-46d9-09d1f0c8fe90', NULL, 706000.00, 0.00, 0.00, 'shipped', 'paid', 'qris', NULL, '{\"recipient\":\"Ratna Sari\",\"phone\":\"08330100022\",\"address\":\"Jl. Pejanggik No. 9, Pejanggik, Mataram 83117\"}', '2026-11-11 07:01:02', '2026-11-12 13:20:02'),
(49, 'FKU-20261111-9048', 'normal', NULL, NULL, '2026-11-13 05:30:02', '76fe5857-9fc0-e31b-449f-0ec9892d2459', 2, 174000.00, 0.00, 20000.00, 'received', 'paid', 'midtrans', 'snap-86715aea35fcbde5', '{\"recipient\":\"Lestari Ningsih\",\"phone\":\"08700100059\",\"address\":\"Jl. Raya Darmo No. 45, Darmo, Surabaya 60241\"}', '2026-11-11 04:44:02', '2026-11-13 05:30:02'),
(50, 'FKU-20261111-9049', 'normal', NULL, NULL, NULL, '17aa9f53-81c1-7db5-a094-14b0cae5d4f2', NULL, 340000.00, 0.00, 0.00, 'shipped', 'paid', 'bank_transfer', NULL, '{\"recipient\":\"Sinta Maharani\",\"phone\":\"08110100000\",\"address\":\"Jl. Panglima Polim V No. 8, Gunung, Jakarta Selatan 12160\"}', '2026-11-11 02:27:02', '2026-11-12 10:50:02'),
(51, 'FKU-20261111-9050', 'normal', NULL, NULL, '2026-11-13 04:08:02', 'e237eb66-fa74-3577-7aed-437a8db49b60', NULL, 1276000.00, 0.00, 0.00, 'received', 'paid', 'ewallet', NULL, '{\"recipient\":\"Oscar Simbolon\",\"phone\":\"08480100037\",\"address\":\"Jl. Jend. Sudirman No. 88, Pucang Kertu, Sidoarjo 61213\"}', '2026-11-11 00:10:02', '2026-11-13 04:08:02'),
(52, 'FKU-20261111-9051', 'normal', NULL, NULL, '2026-11-13 03:27:02', 'cf1106a3-b582-6454-caed-c4b9d720bdcd', NULL, 378000.00, 0.00, 0.00, 'received', 'paid', 'qris', NULL, '{\"recipient\":\"Brigita Sitorus\",\"phone\":\"08850100074\",\"address\":\"Jl. Tanjung Duren Utara No. 21, Tanjung Duren, Jakarta Barat 11470\"}', '2026-11-10 21:53:02', '2026-11-13 03:27:02'),
(53, 'FKU-20261110-9052', 'normal', NULL, NULL, '2026-11-12 21:36:02', '4937a1c4-62c8-5d35-3433-527614265df0', NULL, 648000.00, 0.00, 0.00, 'completed', 'paid', 'midtrans', 'snap-408cf2e71ce06495', '{\"recipient\":\"Hendra Wijaya\",\"phone\":\"08260100015\",\"address\":\"Jl. Raya Ubud No. 15, Ubud, Gianyar 80571\"}', '2026-11-10 02:24:02', '2026-11-13 12:00:02'),
(54, 'FKU-20261110-9053', 'normal', NULL, NULL, '2026-11-12 19:57:02', '2f5b0694-e364-f9bd-e445-034953d50131', NULL, 1026000.00, 0.00, 0.00, 'received', 'paid', 'bank_transfer', NULL, '{\"recipient\":\"Eko Purnomo\",\"phone\":\"08630100052\",\"address\":\"Jl. Dr. Setiabudi No. 210, Pasteur, Bandung 40161\"}', '2026-11-09 20:53:02', '2026-11-12 19:57:02'),
(55, 'FKU-20261109-9054', 'normal', NULL, NULL, NULL, '568ac464-063b-302b-c6f0-9a384b93f540', NULL, 998000.00, 0.00, 0.00, 'cancelled', 'cancelled', 'ewallet', NULL, '{\"recipient\":\"Qodratullah Hasan\",\"phone\":\"08110100089\",\"address\":\"Jl. Veteran No. 66, Kemang Manis, Palembang 30131\"}', '2026-11-09 15:22:02', '2026-11-10 23:29:02'),
(56, 'FKU-20261109-9055', 'normal', NULL, NULL, '2026-11-12 16:38:02', 'cb8dbbb2-6e48-067a-4c9e-e8cfd2d385cb', NULL, 398000.00, 0.00, 0.00, 'received', 'paid', 'qris', NULL, '{\"recipient\":\"Hana Safitri\",\"phone\":\"08410100030\",\"address\":\"Jl. Margonda Raya No. 78, Mekarsari, Depok 16411\"}', '2026-11-09 09:51:02', '2026-11-12 16:38:02'),
(57, 'FKU-20261109-9056', 'normal', NULL, NULL, '2026-11-12 14:59:02', '5e73f21e-65ff-583e-b0b2-49790262bd99', NULL, 1256000.00, 0.00, 0.00, 'completed', 'paid', 'midtrans', 'snap-480a730c9ca408fa', '{\"recipient\":\"Tomi Gunawan\",\"phone\":\"08780100067\",\"address\":\"Jl. Wolter Monginsidi No. 73, Kota Karang, Bandar Lampung 35116\"}', '2026-11-09 04:20:02', '2026-11-13 08:41:02'),
(58, 'FKU-20261109-9057', 'normal', NULL, NULL, '2026-11-12 13:20:02', '20fea1be-a8f1-ea19-daa2-891de5e06685', NULL, 578000.00, 0.00, 0.00, 'received', 'paid', 'bank_transfer', NULL, '{\"recipient\":\"Melati Anggraini\",\"phone\":\"08190100008\",\"address\":\"Jl. Slamet Riyadi No. 456, Sriwedari, Surakarta 57141\"}', '2026-11-08 22:49:02', '2026-11-12 13:20:02'),
(59, 'FKU-20261109-9058', 'normal', NULL, NULL, '2026-11-12 11:40:02', '4a41bf20-08d0-3256-2da1-473d2df9332d', NULL, 538000.00, 0.00, 0.00, 'received', 'paid', 'ewallet', NULL, '{\"recipient\":\"Wulan Sari\",\"phone\":\"08560100045\",\"address\":\"Jl. MT Haryono No. 55, Klandasan Ilir, Balikpapan 76112\"}', '2026-11-08 17:18:02', '2026-11-12 11:40:02'),
(60, 'FKU-20261108-9059', 'normal', NULL, NULL, '2026-11-12 10:01:02', 'a61ecb87-2715-a57d-a602-f41571558b3e', NULL, 1296000.00, 0.00, 0.00, 'received', 'paid', 'qris', NULL, '{\"recipient\":\"Juwita Sari\",\"phone\":\"08930100082\",\"address\":\"Jl. Gejayan No. 112, Demangan, Kota Yogyakarta 55281\"}', '2026-11-08 11:47:02', '2026-11-12 10:01:02'),
(61, 'FKU-20261108-9060', 'normal', NULL, NULL, '2026-11-12 08:22:02', 'ecb48677-ccbf-7d3d-76fd-8944218e0781', 5, 389300.00, 68700.00, 0.00, 'completed', 'paid', 'midtrans', 'snap-b20a17e8c4f3d707', '{\"recipient\":\"Ilham Maulana\",\"phone\":\"08340100023\",\"address\":\"Jl. Tgk. Chik Ditiro No. 61, Kupiah, Banda Aceh 23352\"}', '2026-11-08 06:16:02', '2026-11-13 05:23:02'),
(62, 'FKU-20261108-9061', 'normal', NULL, NULL, '2026-11-12 06:42:02', 'fb22fb2e-476d-d51c-8f73-08aa30e70f4b', NULL, 638000.00, 0.00, 0.00, 'received', 'paid', 'bank_transfer', NULL, '{\"recipient\":\"Miko Alfandi\",\"phone\":\"08710100060\",\"address\":\"Jl. Basuki Rahmat No. 29, Klojen, Malang 65112\"}', '2026-11-08 00:45:02', '2026-11-12 06:42:02'),
(63, 'FKU-20261108-9062', 'normal', NULL, NULL, '2026-11-12 05:03:02', '581c734e-1148-d4a2-2ba7-f6d32cc31d0f', NULL, 1146000.00, 0.00, 0.00, 'received', 'paid', 'ewallet', NULL, '{\"recipient\":\"Dimas Prayoga\",\"phone\":\"08120100001\",\"address\":\"Jl. Cikini Raya No. 45, Cikini, Jakarta Pusat 10330\"}', '2026-11-07 19:14:02', '2026-11-12 05:03:02'),
(64, 'FKU-20261107-9063', 'normal', NULL, NULL, '2026-11-12 03:24:02', '028f8278-dfa1-4d9d-a2fb-eddd26813921', NULL, 718000.00, 0.00, 0.00, 'received', 'paid', 'qris', NULL, '{\"recipient\":\"Prasetyo Adi\",\"phone\":\"08490100038\",\"address\":\"Jl. Danau Tamblingan No. 22, Sanur, Denpasar 80228\"}', '2026-11-07 13:43:02', '2026-11-12 03:24:02'),
(65, 'FKU-20261107-9064', 'normal', NULL, NULL, '2026-11-12 01:44:02', '36333497-c72b-06cc-4875-815d9af60356', NULL, 708000.00, 0.00, 0.00, 'completed', 'paid', 'midtrans', 'snap-2ab5e25976d1a19f', '{\"recipient\":\"Cahyo Nugroho\",\"phone\":\"08860100075\",\"address\":\"Jl. Cipaganti No. 87, Cipaganti, Bandung 40131\"}', '2026-11-07 08:12:02', '2026-11-13 02:04:02'),
(66, 'FKU-20261107-9065', 'normal', NULL, NULL, '2026-11-12 00:05:02', '87ee7bc6-865f-4f03-f910-a1d267178717', NULL, 1506000.00, 0.00, 0.00, 'received', 'paid', 'bank_transfer', NULL, '{\"recipient\":\"Clara Simanjuntak\",\"phone\":\"08270100016\",\"address\":\"Jl. Gatot Subroto No. 301, Sedayu, Medan 20123\"}', '2026-11-07 02:41:02', '2026-11-12 00:05:02'),
(67, 'FKU-20261107-9066', 'normal', NULL, NULL, '2026-11-11 22:26:02', 'c867f90f-7824-10fe-2aa3-2359ffe920a3', 3, 1223000.00, 75000.00, 0.00, 'completed', 'paid', 'ewallet', NULL, '{\"recipient\":\"Farah Nabila\",\"phone\":\"08640100053\",\"address\":\"Jl. Ahmad Yani No. 12, Jaka Mulya, Bekasi 17146\"}', '2026-11-06 21:10:02', '2026-11-13 00:25:02'),
(68, 'FKU-20261106-9067', 'normal', NULL, NULL, '2026-11-11 20:47:02', '3dbd1354-8f7a-40b0-6247-23fcd4c8f491', NULL, 838000.00, 0.00, 0.00, 'completed', 'paid', 'qris', NULL, '{\"recipient\":\"Rahmat Hidayat\",\"phone\":\"08120100090\",\"address\":\"Jl. Soekarno Hatta No. 141, Harjosari, Pekanbaru 28292\"}', '2026-11-06 15:39:02', '2026-11-12 23:35:02'),
(69, 'FKU-20261106-9068', 'normal', NULL, NULL, '2026-11-11 19:07:02', '8c0d42e6-e169-f777-614c-4c86da4b386d', NULL, 1246000.00, 0.00, 0.00, 'completed', 'paid', 'midtrans', 'snap-b373c4fe5cbd7f64', '{\"recipient\":\"Irfan Hakim\",\"phone\":\"08420100031\",\"address\":\"Jl. Pandanaran No. 34, Bendungan, Semarang 50231\"}', '2026-11-06 10:08:02', '2026-11-12 22:46:02'),
(70, 'FKU-20261106-9069', 'normal', NULL, NULL, '2026-11-11 17:28:02', '1b27d6c4-11e9-13d0-67d2-810e998376cc', NULL, 280000.00, 0.00, 0.00, 'completed', 'paid', 'bank_transfer', NULL, '{\"recipient\":\"Umi Kalsum\",\"phone\":\"08790100068\",\"address\":\"Jl. Boulevard No. 18, Karama, Makassar 90231\"}', '2026-11-06 04:37:02', '2026-11-12 21:56:02'),
(71, 'FKU-20261106-9070', 'normal', NULL, NULL, '2026-11-11 15:49:02', 'd741cf38-85e7-6fdc-bfb4-e9f01fa0ac4a', NULL, 538000.00, 0.00, 0.00, 'completed', 'paid', 'ewallet', NULL, '{\"recipient\":\"Yoga Saputra\",\"phone\":\"08200100009\",\"address\":\"Jl. Kaliurang KM 6 No. 19, Caturtunggal, Sleman 55281\"}', '2026-11-05 23:06:02', '2026-11-12 21:06:02'),
(72, 'FKU-20261106-9071', 'normal', NULL, NULL, '2026-11-11 14:09:02', '53c58789-9a09-c2a9-e0cd-c840a7530ddb', NULL, 1126000.00, 0.00, 0.00, 'completed', 'paid', 'qris', NULL, '{\"recipient\":\"Yoga Pranata\",\"phone\":\"08570100046\",\"address\":\"Jl. Pejanggik No. 9, Pejanggik, Mataram 83117\"}', '2026-11-05 17:35:02', '2026-11-12 20:17:02'),
(73, 'FKU-20261105-9072', 'normal', NULL, NULL, '2026-11-11 12:30:02', '865931e8-2cc7-befe-d1a4-40f2184e8564', 3, 520200.00, 57800.00, 0.00, 'completed', 'paid', 'midtrans', 'snap-b04cd3ca963f966d', '{\"recipient\":\"Kemal Ataturk\",\"phone\":\"08940100083\",\"address\":\"Jl. Raya Darmo No. 45, Darmo, Surabaya 60241\"}', '2026-11-05 12:04:02', '2026-11-12 19:27:02'),
(74, 'FKU-20261105-9073', 'normal', NULL, NULL, '2026-11-11 10:51:02', '8422156d-3226-4379-1db3-86d8a6f18a5e', NULL, 508000.00, 0.00, 0.00, 'completed', 'paid', 'bank_transfer', NULL, '{\"recipient\":\"Vina Oktaviani\",\"phone\":\"08350100024\",\"address\":\"Jl. Panglima Polim V No. 8, Gunung, Jakarta Selatan 12160\"}', '2026-11-05 06:33:02', '2026-11-12 18:37:02'),
(75, 'FKU-20261105-9074', 'normal', NULL, NULL, '2026-11-11 09:11:02', 'd6279585-7e9d-a7d9-50b8-d20071ff20d5', NULL, 1486000.00, 0.00, 0.00, 'completed', 'paid', 'ewallet', NULL, '{\"recipient\":\"Nadya Salsabila\",\"phone\":\"08720100061\",\"address\":\"Jl. Jend. Sudirman No. 88, Pucang Kertu, Sidoarjo 61213\"}', '2026-11-05 01:02:02', '2026-11-12 17:48:02'),
(76, 'FKU-20261105-9075', 'normal', NULL, NULL, '2026-11-11 07:32:02', '49be2788-69c8-d175-966e-a15bfc44a012', NULL, 578000.00, 0.00, 0.00, 'completed', 'paid', 'qris', NULL, '{\"recipient\":\"Alya Putri\",\"phone\":\"08130100002\",\"address\":\"Jl. Tanjung Duren Utara No. 21, Tanjung Duren, Jakarta Barat 11470\"}', '2026-11-04 19:31:02', '2026-11-12 16:58:02'),
(77, 'FKU-20261104-9076', 'normal', NULL, NULL, '2026-11-11 05:53:02', '6fbb8c86-9231-b8a1-88d3-646663652350', NULL, 648000.00, 0.00, 0.00, 'completed', 'paid', 'midtrans', 'snap-a3523ac9e1ca9a3d', '{\"recipient\":\"Qonita Rahma\",\"phone\":\"08500100039\",\"address\":\"Jl. Raya Ubud No. 15, Ubud, Gianyar 80571\"}', '2026-11-04 14:00:02', '2026-11-12 16:08:02'),
(78, 'FKU-20261104-9077', 'normal', NULL, NULL, '2026-11-11 04:14:02', 'c0d89002-20de-8855-3335-a6eb7ec4038f', NULL, 1026000.00, 0.00, 0.00, 'completed', 'paid', 'bank_transfer', NULL, '{\"recipient\":\"Dian Purnamasari\",\"phone\":\"08870100076\",\"address\":\"Jl. Dr. Setiabudi No. 210, Pasteur, Bandung 40161\"}', '2026-11-04 08:29:02', '2026-11-12 15:19:02'),
(79, 'FKU-20261104-9078', 'normal', NULL, NULL, '2026-11-11 02:34:02', '3b0b84b6-6ba3-0c40-a16d-a075b449aa0d', 7, 898000.00, 100000.00, 0.00, 'completed', 'paid', 'ewallet', NULL, '{\"recipient\":\"Bimo Aditya\",\"phone\":\"08280100017\",\"address\":\"Jl. Veteran No. 66, Kemang Manis, Palembang 30131\"}', '2026-11-04 02:58:02', '2026-11-12 14:29:02'),
(80, 'FKU-20261104-9079', 'normal', NULL, NULL, '2026-11-11 00:55:02', 'bf03fbce-d1d2-7300-136d-f61e4acdbe91', NULL, 398000.00, 0.00, 0.00, 'completed', 'paid', 'qris', NULL, '{\"recipient\":\"Galih Prakoso\",\"phone\":\"08650100054\",\"address\":\"Jl. Margonda Raya No. 78, Mekarsari, Depok 16411\"}', '2026-11-03 21:27:02', '2026-11-12 13:39:02'),
(81, 'FKU-20261103-9080', 'normal', NULL, NULL, '2026-11-10 23:16:02', '1e269f2c-8386-1ef0-ff8e-1494bf3746a3', NULL, 1256000.00, 0.00, 0.00, 'completed', 'paid', 'midtrans', 'snap-e32139ee8a3accf6', '{\"recipient\":\"Suhailah Rahman\",\"phone\":\"08130100091\",\"address\":\"Jl. Wolter Monginsidi No. 73, Kota Karang, Bandar Lampung 35116\"}', '2026-11-03 15:56:02', '2026-11-12 12:50:02'),
(82, 'FKU-20261103-9081', 'normal', NULL, NULL, NULL, '05ae4bc5-19bf-91e6-d6d6-f78747261a7f', NULL, 578000.00, 0.00, 0.00, 'cancelled', 'cancelled', 'bank_transfer', NULL, '{\"recipient\":\"Jessica Tanoto\",\"phone\":\"08430100032\",\"address\":\"Jl. Slamet Riyadi No. 456, Sriwedari, Surakarta 57141\"}', '2026-11-03 10:25:02', '2026-11-06 15:13:02'),
(83, 'FKU-20261103-9082', 'normal', NULL, NULL, '2026-11-10 19:57:02', '62846adc-59a0-1459-ca7b-6d67b7cb98bb', NULL, 538000.00, 0.00, 0.00, 'completed', 'paid', 'ewallet', NULL, '{\"recipient\":\"Verdiansyah Putra\",\"phone\":\"08800100069\",\"address\":\"Jl. MT Haryono No. 55, Klandasan Ilir, Balikpapan 76112\"}', '2026-11-03 04:54:02', '2026-11-12 11:11:02'),
(84, 'FKU-20261103-9083', 'normal', NULL, NULL, '2026-11-10 18:18:02', 'dee09934-26d8-29d8-36e1-1781d5de4a77', NULL, 1296000.00, 0.00, 0.00, 'completed', 'paid', 'qris', NULL, '{\"recipient\":\"Dewi Lestari\",\"phone\":\"08210100010\",\"address\":\"Jl. Gejayan No. 112, Demangan, Kota Yogyakarta 55281\"}', '2026-11-02 23:23:02', '2026-11-12 10:21:02'),
(85, 'FKU-20261030-9084', 'normal', NULL, NULL, '2026-11-09 14:24:02', '3321e0dd-e12f-8a1a-db98-d2bc759a8436', 1, 433000.00, 25000.00, 0.00, 'completed', 'paid', 'midtrans', 'snap-dc3994e5b8fb4496', '{\"recipient\":\"Zahra Amelia\",\"phone\":\"08580100047\",\"address\":\"Jl. Tgk. Chik Ditiro No. 61, Kupiah, Banda Aceh 23352\"}', '2026-10-30 02:24:02', '2026-11-11 20:24:02'),
(86, 'FKU-20261029-9085', 'normal', NULL, NULL, '2026-11-09 06:33:02', '3221a57c-2610-e0e3-593c-6b7c8f444086', NULL, 638000.00, 0.00, 0.00, 'completed', 'paid', 'bank_transfer', NULL, '{\"recipient\":\"Lidya Manurung\",\"phone\":\"08950100084\",\"address\":\"Jl. Basuki Rahmat No. 29, Klojen, Malang 65112\"}', '2026-10-29 00:13:02', '2026-11-11 16:28:02'),
(87, 'FKU-20261028-9086', 'normal', NULL, NULL, '2026-11-08 22:41:02', '487eb68d-0b76-e01a-b043-b572294cd606', NULL, 1146000.00, 0.00, 0.00, 'completed', 'paid', 'ewallet', NULL, '{\"recipient\":\"Bayu Firmansyah\",\"phone\":\"08360100025\",\"address\":\"Jl. Cikini Raya No. 45, Cikini, Jakarta Pusat 10330\"}', '2026-10-27 22:02:02', '2026-11-11 12:33:02'),
(88, 'FKU-20261027-9087', 'normal', NULL, NULL, '2026-11-08 14:50:02', '38a478fc-af46-dab9-a7f9-ebe250220e5c', NULL, 718000.00, 0.00, 0.00, 'completed', 'paid', 'qris', NULL, '{\"recipient\":\"Oki Setiabudi\",\"phone\":\"08730100062\",\"address\":\"Jl. Danau Tamblingan No. 22, Sanur, Denpasar 80228\"}', '2026-10-26 19:51:02', '2026-11-11 08:37:02'),
(89, 'FKU-20261026-9088', 'normal', NULL, NULL, '2026-11-08 06:59:02', '306cd17b-c0d6-b1b1-cf06-11f5c3ebfabc', NULL, 708000.00, 0.00, 0.00, 'completed', 'paid', 'midtrans', 'snap-58aa9ed190e76cc3', '{\"recipient\":\"Bagus Wicaksono\",\"phone\":\"08140100003\",\"address\":\"Jl. Cipaganti No. 87, Cipaganti, Bandung 40131\"}', '2026-10-25 17:40:02', '2026-11-11 04:41:02'),
(90, 'FKU-20261024-9089', 'normal', NULL, NULL, '2026-11-07 23:08:02', '0112d875-50e7-9f82-e3db-8b236203ae0c', NULL, 1576000.00, 0.00, 0.00, 'completed', 'paid', 'bank_transfer', NULL, '{\"recipient\":\"Rangga Pratama\",\"phone\":\"08510100040\",\"address\":\"Jl. Gatot Subroto No. 301, Sedayu, Medan 20123\"}', '2026-10-24 15:29:02', '2026-11-11 00:46:02'),
(91, 'FKU-20261023-9090', 'normal', NULL, NULL, '2026-11-07 15:16:02', '83981746-29d9-2a4e-4c3d-45ae19bcb789', 3, 1223000.00, 75000.00, 0.00, 'completed', 'paid', 'ewallet', NULL, '{\"recipient\":\"Erlangga Putra\",\"phone\":\"08880100077\",\"address\":\"Jl. Ahmad Yani No. 12, Jaka Mulya, Bekasi 17146\"}', '2026-10-23 13:18:02', '2026-11-10 20:50:02'),
(92, 'FKU-20261022-9091', 'normal', NULL, NULL, '2026-11-07 07:25:02', 'a83143c9-3367-62a4-1a5c-d250674a1646', NULL, 838000.00, 0.00, 0.00, 'completed', 'paid', 'qris', NULL, '{\"recipient\":\"Sari Wulandari\",\"phone\":\"08290100018\",\"address\":\"Jl. Soekarno Hatta No. 141, Harjosari, Pekanbaru 28292\"}', '2026-10-22 11:07:02', '2026-11-10 16:54:02'),
(93, 'FKU-20261021-9092', 'normal', NULL, NULL, '2026-11-06 23:34:02', '7bdd6f0a-3f48-e6e8-ee16-ec8e84ff19ca', NULL, 1446000.00, 0.00, 0.00, 'completed', 'paid', 'midtrans', 'snap-9669fd39aa579e3b', '{\"recipient\":\"Hesti Puspitasari\",\"phone\":\"08660100055\",\"address\":\"Jl. Pandanaran No. 34, Bendungan, Semarang 50231\"}', '2026-10-21 08:56:02', '2026-11-10 12:59:02'),
(94, 'FKU-20261020-9093', 'normal', NULL, NULL, '2026-11-06 15:42:02', 'e61c80b0-3705-187e-58b5-70d1edb6ed8f', NULL, 274000.00, 0.00, 0.00, 'completed', 'paid', 'bank_transfer', NULL, '{\"recipient\":\"Teguh Santoso\",\"phone\":\"08140100092\",\"address\":\"Jl. Boulevard No. 18, Karama, Makassar 90231\"}', '2026-10-20 06:45:02', '2026-11-10 09:03:02'),
(95, 'FKU-20261019-9094', 'normal', NULL, NULL, '2026-11-06 07:51:02', '6523275d-f48d-41a5-0d49-72d139ce2711', NULL, 708000.00, 0.00, 0.00, 'completed', 'paid', 'ewallet', NULL, '{\"recipient\":\"Kevin Santoso\",\"phone\":\"08440100033\",\"address\":\"Jl. Kaliurang KM 6 No. 19, Caturtunggal, Sleman 55281\"}', '2026-10-19 04:34:02', '2026-11-10 05:08:02'),
(96, 'FKU-20261018-9095', 'normal', NULL, NULL, '2026-11-06 00:00:02', '777afe4c-4837-d716-a13c-846e9cd8cd7a', NULL, 1546000.00, 0.00, 0.00, 'completed', 'paid', 'qris', NULL, '{\"recipient\":\"Winda Kartika\",\"phone\":\"08810100070\",\"address\":\"Jl. Pejanggik No. 9, Pejanggik, Mataram 83117\"}', '2026-10-18 02:23:02', '2026-11-10 01:12:02'),
(97, 'FKU-20261017-9096', 'normal', NULL, NULL, '2026-11-05 16:08:02', 'abe56782-bb24-c759-25f7-e09751e8d336', 1, 833000.00, 25000.00, 0.00, 'completed', 'paid', 'midtrans', 'snap-37990fa9c470ad9b', '{\"recipient\":\"Fajar Nugroho\",\"phone\":\"08220100011\",\"address\":\"Jl. Raya Darmo No. 45, Darmo, Surabaya 60241\"}', '2026-10-17 00:12:02', '2026-11-09 21:16:02'),
(98, 'FKU-20261016-9097', 'normal', NULL, NULL, '2026-11-05 08:17:02', 'c323571d-d64c-f97c-2808-140d3610f2eb', NULL, 858000.00, 0.00, 0.00, 'completed', 'paid', 'bank_transfer', NULL, '{\"recipient\":\"Aditya Nugraha\",\"phone\":\"08590100048\",\"address\":\"Jl. Panglima Polim V No. 8, Gunung, Jakarta Selatan 12160\"}', '2026-10-15 22:01:02', '2026-11-09 17:21:02'),
(99, 'FKU-20261015-9098', 'normal', NULL, NULL, '2026-11-05 00:26:02', '89a52d76-3cfc-c24c-cb98-21a4a56adbda', NULL, 1236000.00, 0.00, 0.00, 'completed', 'paid', 'ewallet', NULL, '{\"recipient\":\"Maulana Yusuf\",\"phone\":\"08960100085\",\"address\":\"Jl. Jend. Sudirman No. 88, Pucang Kertu, Sidoarjo 61213\"}', '2026-10-14 19:50:02', '2026-11-09 13:25:02'),
(100, 'FKU-20261014-9099', 'normal', NULL, NULL, '2026-11-04 16:35:02', 'c9858af3-80a2-1b07-293a-da94c650ac94', NULL, 638000.00, 0.00, 0.00, 'completed', 'paid', 'qris', NULL, '{\"recipient\":\"Citra Kirana\",\"phone\":\"08370100026\",\"address\":\"Jl. Tanjung Duren Utara No. 21, Tanjung Duren, Jakarta Barat 11470\"}', '2026-10-13 17:39:02', '2026-11-09 09:29:02'),
(101, 'FKU-20261012-9100', 'normal', NULL, NULL, '2026-11-04 08:43:02', '37fcb800-49bf-9dbf-c867-fc9d233699c1', NULL, 498000.00, 0.00, 0.00, 'completed', 'paid', 'midtrans', 'snap-cf90a220dcf1ca04', '{\"recipient\":\"Putra Mahendra\",\"phone\":\"08740100063\",\"address\":\"Jl. Raya Ubud No. 15, Ubud, Gianyar 80571\"}', '2026-10-12 15:28:02', '2026-11-09 05:34:02'),
(102, 'FKU-20261011-9101', 'normal', NULL, NULL, '2026-11-04 00:52:02', '01e1e35a-187c-d961-58ca-25d230056614', NULL, 896000.00, 0.00, 0.00, 'completed', 'paid', 'bank_transfer', NULL, '{\"recipient\":\"Nadia Kusuma\",\"phone\":\"08150100004\",\"address\":\"Jl. Dr. Setiabudi No. 210, Pasteur, Bandung 40161\"}', '2026-10-11 13:17:02', '2026-11-09 01:38:02'),
(103, 'FKU-20261010-9102', 'normal', NULL, NULL, '2026-11-03 17:01:02', 'adae9f8e-378d-b2a2-3122-70eb31a99996', 7, 558000.00, 100000.00, 0.00, 'completed', 'paid', 'ewallet', NULL, '{\"recipient\":\"Sylvia Handoko\",\"phone\":\"08520100041\",\"address\":\"Jl. Veteran No. 66, Kemang Manis, Palembang 30131\"}', '2026-10-10 11:06:02', '2026-11-08 21:42:02'),
(104, 'FKU-20261009-9103', 'normal', NULL, NULL, '2026-11-03 09:09:02', '20d503c5-6e99-eb51-0cbd-2725f7e2e876', NULL, 528000.00, 0.00, 0.00, 'completed', 'paid', 'qris', NULL, '{\"recipient\":\"Fransiska Loi\",\"phone\":\"08890100078\",\"address\":\"Jl. Margonda Raya No. 78, Mekarsari, Depok 16411\"}', '2026-10-09 08:55:02', '2026-11-08 17:47:02'),
(105, 'FKU-20261008-9104', 'normal', NULL, NULL, '2026-11-03 01:18:02', 'dc41400c-122c-90f0-d943-48a55f6f9abd', NULL, 1256000.00, 0.00, 0.00, 'completed', 'paid', 'midtrans', 'snap-a2631ace312d28e5', '{\"recipient\":\"Taufik Hidayat\",\"phone\":\"08300100019\",\"address\":\"Jl. Wolter Monginsidi No. 73, Kota Karang, Bandar Lampung 35116\"}', '2026-10-08 06:44:02', '2026-11-08 13:51:02'),
(106, 'FKU-20261007-9105', 'normal', NULL, NULL, '2026-11-02 17:27:02', '0fa38f39-7c4b-b50a-4de5-5843c793c295', NULL, 578000.00, 0.00, 0.00, 'completed', 'paid', 'bank_transfer', NULL, '{\"recipient\":\"Indra Kusuma\",\"phone\":\"08670100056\",\"address\":\"Jl. Slamet Riyadi No. 456, Sriwedari, Surakarta 57141\"}', '2026-10-07 04:33:02', '2026-11-08 09:55:02'),
(107, 'FKU-20261006-9106', 'normal', NULL, NULL, '2026-11-02 09:35:02', '847439d3-e0dd-ae2f-0ee8-9a07860386bd', NULL, 538000.00, 0.00, 0.00, 'completed', 'paid', 'ewallet', NULL, '{\"recipient\":\"Ujang Suryana\",\"phone\":\"08150100093\",\"address\":\"Jl. MT Haryono No. 55, Klandasan Ilir, Balikpapan 76112\"}', '2026-10-06 02:22:02', '2026-11-08 06:00:02'),
(108, 'FKU-20261005-9107', 'normal', NULL, NULL, '2026-11-02 01:44:02', '0dc38b96-2c45-1fef-1143-7c08e97cf3cf', NULL, 1296000.00, 0.00, 0.00, 'completed', 'paid', 'qris', NULL, '{\"recipient\":\"Larasati Dewi\",\"phone\":\"08450100034\",\"address\":\"Jl. Gejayan No. 112, Demangan, Kota Yogyakarta 55281\"}', '2026-10-05 00:11:02', '2026-11-08 02:04:02'),
(109, 'FKU-20261004-9108', 'normal', NULL, NULL, NULL, '68cea60f-963e-3cf9-2f5d-579d2cffe41b', NULL, 458000.00, 0.00, 0.00, 'cancelled', 'cancelled', 'midtrans', 'snap-d0650ab7a9f294cd', '{\"recipient\":\"Yusril Hakim\",\"phone\":\"08820100071\",\"address\":\"Jl. Tgk. Chik Ditiro No. 61, Kupiah, Banda Aceh 23352\"}', '2026-10-03 22:00:02', '2026-10-16 06:31:02'),
(110, 'FKU-20261003-9109', 'normal', NULL, NULL, '2026-11-01 10:02:02', 'd1158e10-1fb5-8d0b-7ab2-b5ad00354462', NULL, 638000.00, 0.00, 0.00, 'completed', 'paid', 'bank_transfer', NULL, '{\"recipient\":\"Intan Permata\",\"phone\":\"08230100012\",\"address\":\"Jl. Basuki Rahmat No. 29, Klojen, Malang 65112\"}', '2026-10-02 19:49:02', '2026-11-07 18:13:02'),
(111, 'FKU-20261002-9110', 'normal', NULL, NULL, '2026-11-01 02:10:02', 'fb358165-f121-342b-620b-53a635217b97', NULL, 1146000.00, 0.00, 0.00, 'completed', 'paid', 'ewallet', NULL, '{\"recipient\":\"Bella Anindita\",\"phone\":\"08600100049\",\"address\":\"Jl. Cikini Raya No. 45, Cikini, Jakarta Pusat 10330\"}', '2026-10-01 17:38:02', '2026-11-07 14:17:02'),
(112, 'FKU-20260930-9111', 'normal', NULL, NULL, '2026-10-31 18:19:02', 'c5d9f141-2619-5ce4-055c-a13b1b030640', NULL, 718000.00, 0.00, 0.00, 'completed', 'paid', 'qris', NULL, '{\"recipient\":\"Novi Andriani\",\"phone\":\"08970100086\",\"address\":\"Jl. Danau Tamblingan No. 22, Sanur, Denpasar 80228\"}', '2026-09-30 15:27:02', '2026-11-07 10:21:02'),
(113, 'FKU-20260929-9112', 'normal', NULL, NULL, '2026-10-31 10:28:02', '8f90ee9c-9303-a25d-6d77-f711e7ef84e6', NULL, 708000.00, 0.00, 0.00, 'completed', 'paid', 'midtrans', 'snap-7bd9ea63c255bb29', '{\"recipient\":\"Donny Saputra\",\"phone\":\"08380100027\",\"address\":\"Jl. Cipaganti No. 87, Cipaganti, Bandung 40131\"}', '2026-09-29 13:16:02', '2026-11-07 06:26:02'),
(114, 'FKU-20260928-9113', 'normal', NULL, NULL, '2026-10-31 02:36:02', '4fe4a5a9-ca82-3950-aa71-8f06a919f0bf', NULL, 1526000.00, 0.00, 0.00, 'completed', 'paid', 'bank_transfer', NULL, '{\"recipient\":\"Qori Amalia\",\"phone\":\"08750100064\",\"address\":\"Jl. Gatot Subroto No. 301, Sedayu, Medan 20123\"}', '2026-09-28 11:05:02', '2026-11-07 02:30:02'),
(115, 'FKU-20260927-9114', 'normal', NULL, NULL, '2026-10-30 18:45:02', '97cec183-eea2-5e70-1751-2819621fdbf2', 3, 1223000.00, 75000.00, 0.00, 'completed', 'paid', 'ewallet', NULL, '{\"recipient\":\"Rizky Pratama\",\"phone\":\"08160100005\",\"address\":\"Jl. Ahmad Yani No. 12, Jaka Mulya, Bekasi 17146\"}', '2026-09-27 08:54:02', '2026-11-06 22:35:02'),
(116, 'FKU-20260926-9115', 'normal', NULL, NULL, '2026-10-30 10:54:02', '4920f24e-514f-e2cd-08c0-3adf50220e53', NULL, 838000.00, 0.00, 0.00, 'completed', 'paid', 'qris', NULL, '{\"recipient\":\"Tegar Afandi\",\"phone\":\"08530100042\",\"address\":\"Jl. Soekarno Hatta No. 141, Harjosari, Pekanbaru 28292\"}', '2026-09-26 06:43:02', '2026-11-06 18:39:02'),
(117, 'FKU-20260925-9116', 'normal', NULL, NULL, '2026-10-30 03:02:02', 'be1f7f6c-786f-886f-70fd-1adf76c06110', NULL, 1276000.00, 0.00, 0.00, 'completed', 'paid', 'midtrans', 'snap-6d659b8d2df7e121', '{\"recipient\":\"Gading Martadinata\",\"phone\":\"08900100079\",\"address\":\"Jl. Pandanaran No. 34, Bendungan, Semarang 50231\"}', '2026-09-25 04:32:02', '2026-11-06 14:43:02'),
(118, 'FKU-20260924-9117', 'normal', NULL, NULL, '2026-10-29 19:11:02', '83fcef72-cc4f-747a-ee98-7ca1bbda04f9', NULL, 268000.00, 0.00, 0.00, 'completed', 'paid', 'bank_transfer', NULL, '{\"recipient\":\"Nabila Syakira\",\"phone\":\"08310100020\",\"address\":\"Jl. Boulevard No. 18, Karama, Makassar 90231\"}', '2026-09-24 02:21:02', '2026-11-06 10:48:02'),
(119, 'FKU-20260923-9118', 'normal', NULL, NULL, '2026-10-29 11:20:02', '8234251c-184e-4d14-e02b-63b6b5869842', NULL, 598000.00, 0.00, 0.00, 'completed', 'paid', 'ewallet', NULL, '{\"recipient\":\"Jihan Aurelia\",\"phone\":\"08680100057\",\"address\":\"Jl. Kaliurang KM 6 No. 19, Caturtunggal, Sleman 55281\"}', '2026-09-23 00:10:02', '2026-11-06 06:52:02'),
(120, 'FKU-20260922-9119', 'normal', NULL, NULL, '2026-10-29 03:29:02', 'dcf53c7b-7960-20e7-e37b-ce04efcd9d31', NULL, 1166000.00, 0.00, 0.00, 'completed', 'paid', 'qris', NULL, '{\"recipient\":\"Vera Marlina\",\"phone\":\"08160100094\",\"address\":\"Jl. Pejanggik No. 9, Pejanggik, Mataram 83117\"}', '2026-09-21 21:59:02', '2026-11-06 02:56:02'),
(121, 'FKU-20260921-9120', 'normal', NULL, NULL, '2026-10-28 19:37:02', '8769c09a-cfd0-0292-f0c8-30b58bf4f1d5', 1, 693000.00, 25000.00, 0.00, 'completed', 'paid', 'midtrans', 'snap-3e06022209f6077c', '{\"recipient\":\"Muhammad Rizki\",\"phone\":\"08460100035\",\"address\":\"Jl. Raya Darmo No. 45, Darmo, Surabaya 60241\"}', '2026-09-20 19:48:02', '2026-11-05 23:01:02'),
(122, 'FKU-20260920-9121', 'normal', NULL, NULL, '2026-10-28 11:46:02', '331429a9-ba63-a268-3e5d-49912a26b5df', NULL, 718000.00, 0.00, 0.00, 'completed', 'paid', 'bank_transfer', NULL, '{\"recipient\":\"Zaskia Mecca\",\"phone\":\"08830100072\",\"address\":\"Jl. Panglima Polim V No. 8, Gunung, Jakarta Selatan 12160\"}', '2026-09-19 17:37:02', '2026-11-05 19:05:02'),
(123, 'FKU-20260918-9122', 'normal', NULL, NULL, '2026-10-28 03:55:02', '03d879fa-ea37-16e7-0382-d9e05bce0ea0', NULL, 796000.00, 0.00, 0.00, 'completed', 'paid', 'ewallet', NULL, '{\"recipient\":\"Reza Fahlevi\",\"phone\":\"08240100013\",\"address\":\"Jl. Jend. Sudirman No. 88, Pucang Kertu, Sidoarjo 61213\"}', '2026-09-18 15:26:02', '2026-11-05 15:09:02'),
(124, 'FKU-20260917-9123', 'normal', NULL, NULL, '2026-10-27 20:03:02', 'ab398d16-9f7d-2929-aa2b-13f81d78d085', NULL, 398000.00, 0.00, 0.00, 'completed', 'paid', 'qris', NULL, '{\"recipient\":\"Chandra Wijaya\",\"phone\":\"08610100050\",\"address\":\"Jl. Tanjung Duren Utara No. 21, Tanjung Duren, Jakarta Barat 11470\"}', '2026-09-17 13:15:02', '2026-11-05 11:14:02'),
(125, 'FKU-20260916-9124', 'normal', NULL, NULL, '2026-10-27 12:12:02', 'dcaf3e0f-c3e0-3dd6-e158-cca1ec2560ad', NULL, 398000.00, 0.00, 0.00, 'completed', 'paid', 'midtrans', 'snap-153df82df71295ab', '{\"recipient\":\"Opan Sofyan\",\"phone\":\"08980100087\",\"address\":\"Jl. Raya Ubud No. 15, Ubud, Gianyar 80571\"}', '2026-09-16 11:04:02', '2026-11-05 07:18:02'),
(126, 'FKU-20260915-9125', 'normal', NULL, NULL, '2026-10-27 04:21:02', 'a59b13c6-da0d-cc36-aa08-7fdb038f3e7a', NULL, 736000.00, 0.00, 0.00, 'completed', 'paid', 'bank_transfer', NULL, '{\"recipient\":\"Eka Puspita\",\"phone\":\"08390100028\",\"address\":\"Jl. Dr. Setiabudi No. 210, Pasteur, Bandung 40161\"}', '2026-09-15 08:53:02', '2026-11-05 03:22:02'),
(127, 'FKU-20260914-9126', 'normal', NULL, NULL, '2026-10-26 20:29:02', 'b430a205-e6c4-f1a2-dd01-89b5c8728d3f', 7, 538000.00, 100000.00, 0.00, 'completed', 'paid', 'ewallet', NULL, '{\"recipient\":\"Rian Adinata\",\"phone\":\"08760100065\",\"address\":\"Jl. Veteran No. 66, Kemang Manis, Palembang 30131\"}', '2026-09-14 06:42:02', '2026-11-04 23:27:02'),
(128, 'FKU-20260913-9127', 'normal', NULL, NULL, '2026-10-26 12:38:02', '32dc5cb6-dfa4-d861-17b7-16128391058c', NULL, 518000.00, 0.00, 0.00, 'completed', 'paid', 'qris', NULL, '{\"recipient\":\"Fitri Handayani\",\"phone\":\"08170100006\",\"address\":\"Jl. Margonda Raya No. 78, Mekarsari, Depok 16411\"}', '2026-09-13 04:31:02', '2026-11-04 19:31:02'),
(129, 'FKU-20260912-9128', 'normal', NULL, NULL, '2026-10-26 04:47:02', 'eb50c71c-58bf-77e2-f3b9-920c25108c95', NULL, 1056000.00, 0.00, 0.00, 'completed', 'paid', 'midtrans', 'snap-2bee241b8e10b918', '{\"recipient\":\"Ulfa Nurlaila\",\"phone\":\"08540100043\",\"address\":\"Jl. Wolter Monginsidi No. 73, Kota Karang, Bandar Lampung 35116\"}', '2026-09-12 02:20:02', '2026-11-04 15:35:02'),
(130, 'FKU-20260911-9129', 'normal', NULL, NULL, '2026-10-25 20:56:02', 'b1bd0bd7-5142-a51a-9155-576acb2bc84e', NULL, 418000.00, 0.00, 0.00, 'completed', 'paid', 'bank_transfer', NULL, '{\"recipient\":\"Hilda Yuliani\",\"phone\":\"08910100080\",\"address\":\"Jl. Slamet Riyadi No. 456, Sriwedari, Surakarta 57141\"}', '2026-09-11 00:09:02', '2026-11-04 11:40:02'),
(131, 'FKU-20260910-9130', 'normal', NULL, NULL, '2026-10-25 13:04:02', 'dd1ecb58-65a6-92bf-dd73-2f17941c977b', NULL, 398000.00, 0.00, 0.00, 'completed', 'paid', 'ewallet', NULL, '{\"recipient\":\"Andi Kurniawan\",\"phone\":\"08320100021\",\"address\":\"Jl. MT Haryono No. 55, Klandasan Ilir, Balikpapan 76112\"}', '2026-09-09 21:58:02', '2026-11-04 07:44:02'),
(132, 'FKU-20260909-9131', 'normal', NULL, NULL, '2026-10-25 05:13:02', '3509673a-1d35-b0b9-594c-ff9f3e19b2a9', NULL, 1196000.00, 0.00, 0.00, 'completed', 'paid', 'qris', NULL, '{\"recipient\":\"Krisna Yudha\",\"phone\":\"08690100058\",\"address\":\"Jl. Gejayan No. 112, Demangan, Kota Yogyakarta 55281\"}', '2026-09-08 19:47:02', '2026-11-04 03:48:02');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` bigint UNSIGNED NOT NULL,
  `sub_order_id` bigint UNSIGNED NOT NULL,
  `product_id` bigint UNSIGNED NOT NULL,
  `variant_id` bigint UNSIGNED DEFAULT NULL,
  `product_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sku` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `thumbnail` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(15,2) NOT NULL,
  `quantity` int UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `sub_order_id`, `product_id`, `variant_id`, `product_name`, `sku`, `thumbnail`, `price`, `quantity`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, 'Kaos Polos Cotton Combed 24s Hitam', 'FKU-KAOS01-S', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&h=900&q=80', 89000.00, 2, '2026-11-14 02:20:02', '2026-11-14 02:20:02'),
(2, 2, 4, 14, 'Kaos Raglan Cotton Blend Navy', 'FKU-KAOS04-S', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&h=900&q=80', 119000.00, 1, '2026-11-14 02:13:02', '2026-11-14 02:13:02'),
(3, 2, 17, 61, 'Kemeja Twill Asimetri Navy', 'FKU-KEME17-M', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&h=900&q=80', 219000.00, 1, '2026-11-14 02:13:02', '2026-11-14 02:13:02'),
(4, 3, 7, 27, 'Kaos Turtle Neck Rib Hitam', 'FKU-KAOS07-L', 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=900&h=900&q=80', 189000.00, 1, '2026-11-14 02:05:02', '2026-11-14 02:05:02'),
(5, 3, 21, 74, 'Jaket Bomber Ripstop Hitam', 'FKU-JAKE21-M', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&h=900&q=80', 459000.00, 2, '2026-11-14 02:05:02', '2026-11-14 02:05:02'),
(6, 3, 32, 124, 'Dress Midi Linen Krem', 'FKU-DRES32-M', 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&h=900&q=80', 279000.00, 1, '2026-11-14 02:05:02', '2026-11-14 02:05:02'),
(7, 4, 11, 40, 'Kemeja Flannel Kotak Maroon', 'FKU-KEME11-L', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&h=900&q=80', 189000.00, 2, '2026-11-14 01:57:02', '2026-11-14 01:57:02'),
(8, 5, 15, 53, 'Kemeja Batik Lengan Panjang Parang', 'FKU-KEME15-S', 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=900&h=900&q=80', 349000.00, 1, '2026-11-14 01:46:02', '2026-11-14 01:46:02'),
(9, 5, 27, 100, 'Celana Cargo Ripstop Olive', 'FKU-CELA27-31', 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&h=900&q=80', 299000.00, 1, '2026-11-14 01:46:02', '2026-11-14 01:46:02'),
(10, 6, 19, 66, 'Jaket Denim Oversize Blue Washed', 'FKU-JAKE19-S', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&h=900&q=80', 329000.00, 1, '2026-11-14 01:32:02', '2026-11-14 01:32:02'),
(11, 6, 30, 116, 'Celana Panjang Kanvas Cokelat', 'FKU-CELA30-34', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&h=900&q=80', 279000.00, 2, '2026-11-14 01:32:02', '2026-11-14 01:32:02'),
(12, 6, 44, 166, 'Blus Crop Boxy Cotton Pink', 'FKU-BLUS44-S', 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=900&h=900&q=80', 139000.00, 1, '2026-11-14 01:32:02', '2026-11-14 01:32:02'),
(13, 7, 22, 79, 'Jaket Hiking Softshell Abu', 'FKU-JAKE22-XL', 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=900&h=900&q=80', 499000.00, 2, '2026-11-14 01:18:02', '2026-11-14 01:18:02'),
(14, 8, 25, 92, 'Celana Chino Slim Fit Khaki', 'FKU-CELA25-33', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&h=900&q=80', 199000.00, 1, '2026-11-14 01:01:02', '2026-11-14 01:01:02'),
(15, 8, 38, 145, 'Dress Sundress Tiered Gingham', 'FKU-DRES38-M', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&h=900&q=80', 199000.00, 1, '2026-11-14 01:01:02', '2026-11-14 01:01:02'),
(16, 9, 28, 105, 'Celana Formal Wool Blend Hitam', 'FKU-CELA28-30', 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=900&h=900&q=80', 459000.00, 1, '2026-11-14 00:47:02', '2026-11-14 00:47:02'),
(17, 9, 42, 158, 'Blus Kerah Peter Pan Putih', 'FKU-BLUS42-S', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&h=900&q=80', 219000.00, 2, '2026-11-14 00:47:02', '2026-11-14 00:47:02'),
(18, 9, 54, 205, 'Blazer Oversized Linen Oat', 'FKU-OUTE54-XL', 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=900&h=900&q=80', 359000.00, 1, '2026-11-14 00:47:02', '2026-11-14 00:47:02'),
(19, 10, 31, 121, 'Celana Jeans Slim Stretch Black', 'FKU-CELA31-33', 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&h=900&q=80', 289000.00, 2, '2026-11-14 00:29:02', '2026-11-14 00:29:02'),
(20, 11, 35, 134, 'Dress Shirt Midi Denim Light', 'FKU-DRES35-M', 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&h=900&q=80', 349000.00, 1, '2026-11-14 00:10:02', '2026-11-14 00:10:02'),
(21, 11, 49, 184, 'Rok Plisket Midi Hitam', 'FKU-ROK49-M', 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&h=900&q=80', 189000.00, 1, '2026-11-14 00:10:02', '2026-11-14 00:10:02'),
(22, 12, 39, 150, 'Dress Kemeja Midi Khaki', 'FKU-DRES39-XL', 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&h=900&q=80', 319000.00, 1, '2026-11-13 23:48:02', '2026-11-13 23:48:02'),
(23, 12, 52, 197, 'Rok Linen Panjang Sage', 'FKU-ROK52-XL', 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&h=900&q=80', 239000.00, 2, '2026-11-13 23:48:02', '2026-11-13 23:48:02'),
(24, 12, 64, 248, 'Boots Chelsea Kulit Cokelat', 'FKU-SEPA64-42', 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&h=900&q=80', 499000.00, 1, '2026-11-13 23:48:02', '2026-11-13 23:48:02'),
(25, 13, 43, 163, 'Blus Oversized Poplin Navy', 'FKU-BLUS43-M', 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&h=900&q=80', 229000.00, 2, '2026-11-13 23:19:02', '2026-11-13 23:19:02'),
(26, 14, 47, 176, 'Blus Knit Cropped Cream', 'FKU-BLUS47-S', 'https://images.unsplash.com/photo-1496217590455-aa63a8350eea?auto=format&fit=crop&w=900&h=900&q=80', 189000.00, 1, '2026-11-13 22:44:02', '2026-11-13 22:44:02'),
(27, 14, 60, 227, 'Sneakers Chunky Retro Silver', 'FKU-SEPA60-40', 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=900&h=900&q=80', 449000.00, 1, '2026-11-13 22:44:02', '2026-11-13 22:44:02'),
(28, 15, 50, 189, 'Rok Denim A-Line Mid Blue', 'FKU-ROK50-L', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&h=900&q=80', 269000.00, 1, '2026-11-13 21:59:02', '2026-11-13 21:59:02'),
(29, 15, 62, 240, 'Loafers Kulit Sintetis Cokelat', 'FKU-SEPA62-43', 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&h=900&q=80', 379000.00, 2, '2026-11-13 21:59:02', '2026-11-13 21:59:02'),
(30, 15, 71, 287, 'Sandal Slide Puffy Hitam', 'FKU-SAND71-44', 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=900&h=900&q=80', 119000.00, 1, '2026-11-13 21:59:02', '2026-11-13 21:59:02'),
(31, 16, 54, 202, 'Blazer Oversized Linen Oat', 'FKU-OUTE54-S', 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=900&h=900&q=80', 359000.00, 2, '2026-11-13 21:14:02', '2026-11-13 21:14:02'),
(32, 17, 57, 215, 'Bomber Satin Wanita Sage', 'FKU-OUTE57-L', 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=900&h=900&q=80', 379000.00, 1, '2026-11-13 20:24:02', '2026-11-13 20:24:02'),
(33, 17, 68, 266, 'Heels Blok Tali Hitam', 'FKU-SEPA68-36', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&h=900&q=80', 329000.00, 1, '2026-11-13 20:24:02', '2026-11-13 20:24:02'),
(34, 18, 61, 232, 'Sepatu Kulit Formal Oxford Hitam', 'FKU-SEPA61-41', 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=900&h=900&q=80', 649000.00, 1, '2026-11-13 19:29:02', '2026-11-13 19:29:02'),
(35, 18, 70, 279, 'Pantofel Wanita Nude', 'FKU-SEPA70-38', 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&h=900&q=80', 299000.00, 2, '2026-11-13 19:29:02', '2026-11-13 19:29:02'),
(36, 18, 2, 6, 'Kaos Oversize Drop Shoulder Cream', 'FKU-KAOS02-S', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&h=900&q=80', 129000.00, 1, '2026-11-13 19:29:02', '2026-11-13 19:29:02'),
(37, 19, 63, 245, 'Pantofel Kulit Asli Navy', 'FKU-SEPA63-44', 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?auto=format&fit=crop&w=900&h=900&q=80', 649000.00, 2, '2026-11-13 18:34:02', '2026-11-13 18:34:02'),
(38, 20, 66, 258, 'Sneakers Running Knit Abu', 'FKU-SEPA66-42', 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=900&h=900&q=80', 459000.00, 1, '2026-11-13 17:24:02', '2026-11-13 17:24:02'),
(39, 20, 82, 310, 'Tas Selempang Kulit Cokelat', 'FKU-TASS82-ORIGINAL', 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&h=900&q=80', 379000.00, 1, '2026-11-13 17:24:02', '2026-11-13 17:24:02'),
(40, 21, 69, 271, 'Sneakers Slip-On Denim', 'FKU-SEPA69-39', 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&h=900&q=80', 329000.00, 1, '2026-11-13 16:14:02', '2026-11-13 16:14:02'),
(41, 21, 96, 324, 'Kacamata Bulat Frame Emas', 'FKU-KACA96-ORIGINAL', 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&h=900&q=80', 329000.00, 2, '2026-11-13 16:14:02', '2026-11-13 16:14:02'),
(42, 21, 12, 43, 'Kemeja Oxford Slim Fit Putih', 'FKU-KEME12-M', 'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=900&h=900&q=80', 259000.00, 1, '2026-11-13 16:14:02', '2026-11-13 16:14:02'),
(43, 22, 71, 284, 'Sandal Slide Puffy Hitam', 'FKU-SAND71-41', 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=900&h=900&q=80', 119000.00, 2, '2026-11-13 14:54:02', '2026-11-13 14:54:02'),
(44, 23, 73, 297, 'Sandal Sport Outdoor Abu', 'FKU-SAND73-44', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&h=900&q=80', 249000.00, 1, '2026-11-13 13:24:02', '2026-11-13 13:24:02'),
(45, 23, 6, 22, 'Kaos Oversize Graphic Slow Living Sand', 'FKU-KAOS06-M', 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=900&h=900&q=80', 169000.00, 1, '2026-11-13 13:24:02', '2026-11-13 13:24:02'),
(46, 24, 88, 316, 'Dompet Kartu Slim Navy', 'FKU-DOMP88-ORIGINAL', 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&h=900&q=80', 119000.00, 1, '2026-11-13 11:54:02', '2026-11-13 11:54:02'),
(47, 24, 10, 35, 'Kaos Undershirt Viscose Putih', 'FKU-KAOS10-M', 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=900&h=900&q=80', 79000.00, 2, '2026-11-13 11:54:02', '2026-11-13 11:54:02'),
(48, 24, 23, 82, 'Jaket Kanvas Kerja Cokelat', 'FKU-JAKE23-XL', 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=900&h=900&q=80', 429000.00, 1, '2026-11-13 11:54:02', '2026-11-13 11:54:02'),
(49, 25, 4, 14, 'Kaos Raglan Cotton Blend Navy', 'FKU-KAOS04-S', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&h=900&q=80', 119000.00, 2, '2026-11-13 10:24:02', '2026-11-13 10:24:02'),
(50, 26, 5, 18, 'Kaos Premium Combed 30s Putih', 'FKU-KAOS05-S', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&h=900&q=80', 89000.00, 1, '2026-11-13 08:24:02', '2026-11-13 08:24:02'),
(51, 26, 17, 61, 'Kemeja Twill Asimetri Navy', 'FKU-KEME17-M', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&h=900&q=80', 219000.00, 1, '2026-11-13 08:24:02', '2026-11-13 08:24:02'),
(52, 27, 7, 27, 'Kaos Turtle Neck Rib Hitam', 'FKU-KAOS07-L', 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=900&h=900&q=80', 189000.00, 1, '2026-11-13 06:24:02', '2026-11-13 06:24:02'),
(53, 27, 21, 74, 'Jaket Bomber Ripstop Hitam', 'FKU-JAKE21-M', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&h=900&q=80', 459000.00, 2, '2026-11-13 06:24:02', '2026-11-13 06:24:02'),
(54, 27, 32, 124, 'Dress Midi Linen Krem', 'FKU-DRES32-M', 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&h=900&q=80', 279000.00, 1, '2026-11-13 06:24:02', '2026-11-13 06:24:02'),
(55, 28, 11, 40, 'Kemeja Flannel Kotak Maroon', 'FKU-KEME11-L', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&h=900&q=80', 189000.00, 2, '2026-11-13 04:24:02', '2026-11-13 04:24:02'),
(56, 29, 15, 53, 'Kemeja Batik Lengan Panjang Parang', 'FKU-KEME15-S', 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=900&h=900&q=80', 349000.00, 1, '2026-11-13 02:24:02', '2026-11-13 02:24:02'),
(57, 29, 27, 100, 'Celana Cargo Ripstop Olive', 'FKU-CELA27-31', 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&h=900&q=80', 299000.00, 1, '2026-11-13 02:24:02', '2026-11-13 02:24:02'),
(58, 30, 19, 66, 'Jaket Denim Oversize Blue Washed', 'FKU-JAKE19-S', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&h=900&q=80', 329000.00, 1, '2026-11-13 00:07:02', '2026-11-13 00:07:02'),
(59, 30, 30, 116, 'Celana Panjang Kanvas Cokelat', 'FKU-CELA30-34', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&h=900&q=80', 279000.00, 2, '2026-11-13 00:07:02', '2026-11-13 00:07:02'),
(60, 30, 44, 166, 'Blus Crop Boxy Cotton Pink', 'FKU-BLUS44-S', 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=900&h=900&q=80', 139000.00, 1, '2026-11-13 00:07:02', '2026-11-13 00:07:02'),
(61, 31, 22, 79, 'Jaket Hiking Softshell Abu', 'FKU-JAKE22-XL', 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=900&h=900&q=80', 499000.00, 2, '2026-11-12 21:50:02', '2026-11-12 21:50:02'),
(62, 32, 25, 92, 'Celana Chino Slim Fit Khaki', 'FKU-CELA25-33', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&h=900&q=80', 199000.00, 1, '2026-11-12 19:33:02', '2026-11-12 19:33:02'),
(63, 32, 38, 145, 'Dress Sundress Tiered Gingham', 'FKU-DRES38-M', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&h=900&q=80', 199000.00, 1, '2026-11-12 19:33:02', '2026-11-12 19:33:02'),
(64, 33, 28, 105, 'Celana Formal Wool Blend Hitam', 'FKU-CELA28-30', 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=900&h=900&q=80', 459000.00, 1, '2026-11-12 17:16:02', '2026-11-12 17:16:02'),
(65, 33, 42, 158, 'Blus Kerah Peter Pan Putih', 'FKU-BLUS42-S', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&h=900&q=80', 219000.00, 2, '2026-11-12 17:16:02', '2026-11-12 17:16:02'),
(66, 33, 54, 205, 'Blazer Oversized Linen Oat', 'FKU-OUTE54-XL', 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=900&h=900&q=80', 359000.00, 1, '2026-11-12 17:16:02', '2026-11-12 17:16:02'),
(67, 34, 31, 121, 'Celana Jeans Slim Stretch Black', 'FKU-CELA31-33', 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&h=900&q=80', 289000.00, 2, '2026-11-12 14:59:02', '2026-11-12 14:59:02'),
(68, 35, 35, 134, 'Dress Shirt Midi Denim Light', 'FKU-DRES35-M', 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&h=900&q=80', 349000.00, 1, '2026-11-12 12:42:02', '2026-11-12 12:42:02'),
(69, 35, 49, 184, 'Rok Plisket Midi Hitam', 'FKU-ROK49-M', 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&h=900&q=80', 189000.00, 1, '2026-11-12 12:42:02', '2026-11-12 12:42:02'),
(70, 36, 39, 150, 'Dress Kemeja Midi Khaki', 'FKU-DRES39-XL', 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&h=900&q=80', 319000.00, 1, '2026-11-12 10:25:02', '2026-11-12 10:25:02'),
(71, 36, 52, 197, 'Rok Linen Panjang Sage', 'FKU-ROK52-XL', 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&h=900&q=80', 239000.00, 2, '2026-11-12 10:25:02', '2026-11-12 10:25:02'),
(72, 36, 64, 248, 'Boots Chelsea Kulit Cokelat', 'FKU-SEPA64-42', 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&h=900&q=80', 499000.00, 1, '2026-11-12 10:25:02', '2026-11-12 10:25:02'),
(73, 37, 43, 163, 'Blus Oversized Poplin Navy', 'FKU-BLUS43-M', 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&h=900&q=80', 229000.00, 2, '2026-11-12 08:08:02', '2026-11-12 08:08:02'),
(74, 38, 47, 176, 'Blus Knit Cropped Cream', 'FKU-BLUS47-S', 'https://images.unsplash.com/photo-1496217590455-aa63a8350eea?auto=format&fit=crop&w=900&h=900&q=80', 189000.00, 1, '2026-11-12 05:51:02', '2026-11-12 05:51:02'),
(75, 38, 60, 227, 'Sneakers Chunky Retro Silver', 'FKU-SEPA60-40', 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=900&h=900&q=80', 449000.00, 1, '2026-11-12 05:51:02', '2026-11-12 05:51:02'),
(76, 39, 50, 189, 'Rok Denim A-Line Mid Blue', 'FKU-ROK50-L', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&h=900&q=80', 269000.00, 1, '2026-11-12 03:34:02', '2026-11-12 03:34:02'),
(77, 39, 62, 240, 'Loafers Kulit Sintetis Cokelat', 'FKU-SEPA62-43', 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&h=900&q=80', 379000.00, 2, '2026-11-12 03:34:02', '2026-11-12 03:34:02'),
(78, 39, 71, 287, 'Sandal Slide Puffy Hitam', 'FKU-SAND71-44', 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=900&h=900&q=80', 119000.00, 1, '2026-11-12 03:34:02', '2026-11-12 03:34:02'),
(79, 40, 54, 202, 'Blazer Oversized Linen Oat', 'FKU-OUTE54-S', 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=900&h=900&q=80', 359000.00, 2, '2026-11-12 01:17:02', '2026-11-12 01:17:02'),
(80, 41, 57, 215, 'Bomber Satin Wanita Sage', 'FKU-OUTE57-L', 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=900&h=900&q=80', 379000.00, 1, '2026-11-11 23:00:02', '2026-11-11 23:00:02'),
(81, 41, 68, 266, 'Heels Blok Tali Hitam', 'FKU-SEPA68-36', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&h=900&q=80', 329000.00, 1, '2026-11-11 23:00:02', '2026-11-11 23:00:02'),
(82, 42, 61, 232, 'Sepatu Kulit Formal Oxford Hitam', 'FKU-SEPA61-41', 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=900&h=900&q=80', 649000.00, 1, '2026-11-11 20:43:02', '2026-11-11 20:43:02'),
(83, 42, 70, 279, 'Pantofel Wanita Nude', 'FKU-SEPA70-38', 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&h=900&q=80', 299000.00, 2, '2026-11-11 20:43:02', '2026-11-11 20:43:02'),
(84, 42, 10, 35, 'Kaos Undershirt Viscose Putih', 'FKU-KAOS10-M', 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=900&h=900&q=80', 79000.00, 1, '2026-11-11 20:43:02', '2026-11-11 20:43:02'),
(85, 43, 63, 245, 'Pantofel Kulit Asli Navy', 'FKU-SEPA63-44', 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?auto=format&fit=crop&w=900&h=900&q=80', 649000.00, 2, '2026-11-11 18:26:02', '2026-11-11 18:26:02'),
(86, 44, 66, 258, 'Sneakers Running Knit Abu', 'FKU-SEPA66-42', 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=900&h=900&q=80', 459000.00, 1, '2026-11-11 16:09:02', '2026-11-11 16:09:02'),
(87, 44, 82, 310, 'Tas Selempang Kulit Cokelat', 'FKU-TASS82-ORIGINAL', 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&h=900&q=80', 379000.00, 1, '2026-11-11 16:09:02', '2026-11-11 16:09:02'),
(88, 45, 69, 271, 'Sneakers Slip-On Denim', 'FKU-SEPA69-39', 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&h=900&q=80', 329000.00, 1, '2026-11-11 13:52:02', '2026-11-11 13:52:02'),
(89, 45, 96, 324, 'Kacamata Bulat Frame Emas', 'FKU-KACA96-ORIGINAL', 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&h=900&q=80', 329000.00, 2, '2026-11-11 13:52:02', '2026-11-11 13:52:02'),
(90, 45, 12, 43, 'Kemeja Oxford Slim Fit Putih', 'FKU-KEME12-M', 'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=900&h=900&q=80', 259000.00, 1, '2026-11-11 13:52:02', '2026-11-11 13:52:02'),
(91, 46, 71, 284, 'Sandal Slide Puffy Hitam', 'FKU-SAND71-41', 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=900&h=900&q=80', 119000.00, 2, '2026-11-11 11:35:02', '2026-11-11 11:35:02'),
(92, 47, 73, 297, 'Sandal Sport Outdoor Abu', 'FKU-SAND73-44', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&h=900&q=80', 249000.00, 1, '2026-11-11 09:18:02', '2026-11-11 09:18:02'),
(93, 47, 10, 35, 'Kaos Undershirt Viscose Putih', 'FKU-KAOS10-M', 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=900&h=900&q=80', 79000.00, 1, '2026-11-11 09:18:02', '2026-11-11 09:18:02'),
(94, 48, 88, 316, 'Dompet Kartu Slim Navy', 'FKU-DOMP88-ORIGINAL', 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&h=900&q=80', 119000.00, 1, '2026-11-11 07:01:02', '2026-11-11 07:01:02'),
(95, 48, 10, 35, 'Kaos Undershirt Viscose Putih', 'FKU-KAOS10-M', 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=900&h=900&q=80', 79000.00, 2, '2026-11-11 07:01:02', '2026-11-11 07:01:02'),
(96, 48, 23, 82, 'Jaket Kanvas Kerja Cokelat', 'FKU-JAKE23-XL', 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=900&h=900&q=80', 429000.00, 1, '2026-11-11 07:01:02', '2026-11-11 07:01:02'),
(97, 49, 10, 35, 'Kaos Undershirt Viscose Putih', 'FKU-KAOS10-M', 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=900&h=900&q=80', 79000.00, 2, '2026-11-11 04:44:02', '2026-11-11 04:44:02'),
(98, 50, 10, 35, 'Kaos Undershirt Viscose Putih', 'FKU-KAOS10-M', 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=900&h=900&q=80', 79000.00, 1, '2026-11-11 02:27:02', '2026-11-11 02:27:02'),
(99, 50, 17, 61, 'Kemeja Twill Asimetri Navy', 'FKU-KEME17-M', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&h=900&q=80', 219000.00, 1, '2026-11-11 02:27:02', '2026-11-11 02:27:02'),
(100, 51, 10, 35, 'Kaos Undershirt Viscose Putih', 'FKU-KAOS10-M', 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=900&h=900&q=80', 79000.00, 1, '2026-11-11 00:10:02', '2026-11-11 00:10:02'),
(101, 51, 21, 74, 'Jaket Bomber Ripstop Hitam', 'FKU-JAKE21-M', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&h=900&q=80', 459000.00, 2, '2026-11-11 00:10:02', '2026-11-11 00:10:02'),
(102, 51, 32, 124, 'Dress Midi Linen Krem', 'FKU-DRES32-M', 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&h=900&q=80', 279000.00, 1, '2026-11-11 00:10:02', '2026-11-11 00:10:02'),
(103, 52, 11, 40, 'Kemeja Flannel Kotak Maroon', 'FKU-KEME11-L', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&h=900&q=80', 189000.00, 2, '2026-11-10 21:53:02', '2026-11-10 21:53:02'),
(104, 53, 15, 53, 'Kemeja Batik Lengan Panjang Parang', 'FKU-KEME15-S', 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=900&h=900&q=80', 349000.00, 1, '2026-11-10 02:24:02', '2026-11-10 02:24:02'),
(105, 53, 27, 100, 'Celana Cargo Ripstop Olive', 'FKU-CELA27-31', 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&h=900&q=80', 299000.00, 1, '2026-11-10 02:24:02', '2026-11-10 02:24:02'),
(106, 54, 19, 66, 'Jaket Denim Oversize Blue Washed', 'FKU-JAKE19-S', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&h=900&q=80', 329000.00, 1, '2026-11-09 20:53:02', '2026-11-09 20:53:02'),
(107, 54, 30, 116, 'Celana Panjang Kanvas Cokelat', 'FKU-CELA30-34', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&h=900&q=80', 279000.00, 2, '2026-11-09 20:53:02', '2026-11-09 20:53:02'),
(108, 54, 44, 166, 'Blus Crop Boxy Cotton Pink', 'FKU-BLUS44-S', 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=900&h=900&q=80', 139000.00, 1, '2026-11-09 20:53:02', '2026-11-09 20:53:02'),
(109, 55, 22, 79, 'Jaket Hiking Softshell Abu', 'FKU-JAKE22-XL', 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=900&h=900&q=80', 499000.00, 2, '2026-11-09 15:22:02', '2026-11-09 15:22:02'),
(110, 56, 25, 92, 'Celana Chino Slim Fit Khaki', 'FKU-CELA25-33', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&h=900&q=80', 199000.00, 1, '2026-11-09 09:51:02', '2026-11-09 09:51:02'),
(111, 56, 38, 145, 'Dress Sundress Tiered Gingham', 'FKU-DRES38-M', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&h=900&q=80', 199000.00, 1, '2026-11-09 09:51:02', '2026-11-09 09:51:02'),
(112, 57, 28, 105, 'Celana Formal Wool Blend Hitam', 'FKU-CELA28-30', 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=900&h=900&q=80', 459000.00, 1, '2026-11-09 04:20:02', '2026-11-09 04:20:02'),
(113, 57, 42, 158, 'Blus Kerah Peter Pan Putih', 'FKU-BLUS42-S', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&h=900&q=80', 219000.00, 2, '2026-11-09 04:20:02', '2026-11-09 04:20:02'),
(114, 57, 54, 205, 'Blazer Oversized Linen Oat', 'FKU-OUTE54-XL', 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=900&h=900&q=80', 359000.00, 1, '2026-11-09 04:20:02', '2026-11-09 04:20:02'),
(115, 58, 31, 121, 'Celana Jeans Slim Stretch Black', 'FKU-CELA31-33', 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&h=900&q=80', 289000.00, 2, '2026-11-08 22:49:02', '2026-11-08 22:49:02'),
(116, 59, 35, 134, 'Dress Shirt Midi Denim Light', 'FKU-DRES35-M', 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&h=900&q=80', 349000.00, 1, '2026-11-08 17:18:02', '2026-11-08 17:18:02'),
(117, 59, 49, 184, 'Rok Plisket Midi Hitam', 'FKU-ROK49-M', 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&h=900&q=80', 189000.00, 1, '2026-11-08 17:18:02', '2026-11-08 17:18:02'),
(118, 60, 39, 150, 'Dress Kemeja Midi Khaki', 'FKU-DRES39-XL', 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&h=900&q=80', 319000.00, 1, '2026-11-08 11:47:02', '2026-11-08 11:47:02'),
(119, 60, 52, 197, 'Rok Linen Panjang Sage', 'FKU-ROK52-XL', 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&h=900&q=80', 239000.00, 2, '2026-11-08 11:47:02', '2026-11-08 11:47:02'),
(120, 60, 64, 248, 'Boots Chelsea Kulit Cokelat', 'FKU-SEPA64-42', 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&h=900&q=80', 499000.00, 1, '2026-11-08 11:47:02', '2026-11-08 11:47:02'),
(121, 61, 43, 163, 'Blus Oversized Poplin Navy', 'FKU-BLUS43-M', 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&h=900&q=80', 229000.00, 2, '2026-11-08 06:16:02', '2026-11-08 06:16:02'),
(122, 62, 47, 176, 'Blus Knit Cropped Cream', 'FKU-BLUS47-S', 'https://images.unsplash.com/photo-1496217590455-aa63a8350eea?auto=format&fit=crop&w=900&h=900&q=80', 189000.00, 1, '2026-11-08 00:45:02', '2026-11-08 00:45:02'),
(123, 62, 60, 227, 'Sneakers Chunky Retro Silver', 'FKU-SEPA60-40', 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=900&h=900&q=80', 449000.00, 1, '2026-11-08 00:45:02', '2026-11-08 00:45:02'),
(124, 63, 50, 189, 'Rok Denim A-Line Mid Blue', 'FKU-ROK50-L', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&h=900&q=80', 269000.00, 1, '2026-11-07 19:14:02', '2026-11-07 19:14:02'),
(125, 63, 62, 240, 'Loafers Kulit Sintetis Cokelat', 'FKU-SEPA62-43', 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&h=900&q=80', 379000.00, 2, '2026-11-07 19:14:02', '2026-11-07 19:14:02'),
(126, 63, 71, 287, 'Sandal Slide Puffy Hitam', 'FKU-SAND71-44', 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=900&h=900&q=80', 119000.00, 1, '2026-11-07 19:14:02', '2026-11-07 19:14:02'),
(127, 64, 54, 202, 'Blazer Oversized Linen Oat', 'FKU-OUTE54-S', 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=900&h=900&q=80', 359000.00, 2, '2026-11-07 13:43:02', '2026-11-07 13:43:02'),
(128, 65, 57, 215, 'Bomber Satin Wanita Sage', 'FKU-OUTE57-L', 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=900&h=900&q=80', 379000.00, 1, '2026-11-07 08:12:02', '2026-11-07 08:12:02'),
(129, 65, 68, 266, 'Heels Blok Tali Hitam', 'FKU-SEPA68-36', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&h=900&q=80', 329000.00, 1, '2026-11-07 08:12:02', '2026-11-07 08:12:02'),
(130, 66, 61, 232, 'Sepatu Kulit Formal Oxford Hitam', 'FKU-SEPA61-41', 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=900&h=900&q=80', 649000.00, 1, '2026-11-07 02:41:02', '2026-11-07 02:41:02'),
(131, 66, 70, 279, 'Pantofel Wanita Nude', 'FKU-SEPA70-38', 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&h=900&q=80', 299000.00, 2, '2026-11-07 02:41:02', '2026-11-07 02:41:02'),
(132, 66, 12, 42, 'Kemeja Oxford Slim Fit Putih', 'FKU-KEME12-S', 'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=900&h=900&q=80', 259000.00, 1, '2026-11-07 02:41:02', '2026-11-07 02:41:02'),
(133, 67, 63, 245, 'Pantofel Kulit Asli Navy', 'FKU-SEPA63-44', 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?auto=format&fit=crop&w=900&h=900&q=80', 649000.00, 2, '2026-11-06 21:10:02', '2026-11-06 21:10:02'),
(134, 68, 66, 258, 'Sneakers Running Knit Abu', 'FKU-SEPA66-42', 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=900&h=900&q=80', 459000.00, 1, '2026-11-06 15:39:02', '2026-11-06 15:39:02'),
(135, 68, 82, 310, 'Tas Selempang Kulit Cokelat', 'FKU-TASS82-ORIGINAL', 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&h=900&q=80', 379000.00, 1, '2026-11-06 15:39:02', '2026-11-06 15:39:02'),
(136, 69, 69, 271, 'Sneakers Slip-On Denim', 'FKU-SEPA69-39', 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&h=900&q=80', 329000.00, 1, '2026-11-06 10:08:02', '2026-11-06 10:08:02'),
(137, 69, 96, 324, 'Kacamata Bulat Frame Emas', 'FKU-KACA96-ORIGINAL', 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&h=900&q=80', 329000.00, 2, '2026-11-06 10:08:02', '2026-11-06 10:08:02'),
(138, 69, 12, 43, 'Kemeja Oxford Slim Fit Putih', 'FKU-KEME12-M', 'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=900&h=900&q=80', 259000.00, 1, '2026-11-06 10:08:02', '2026-11-06 10:08:02'),
(139, 70, 71, 284, 'Sandal Slide Puffy Hitam', 'FKU-SAND71-41', 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=900&h=900&q=80', 119000.00, 2, '2026-11-06 04:37:02', '2026-11-06 04:37:02'),
(140, 71, 73, 297, 'Sandal Sport Outdoor Abu', 'FKU-SAND73-44', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&h=900&q=80', 249000.00, 1, '2026-11-05 23:06:02', '2026-11-05 23:06:02'),
(141, 71, 13, 46, 'Kemeja Linen Oversize Khaki', 'FKU-KEME13-M', 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&h=900&q=80', 289000.00, 1, '2026-11-05 23:06:02', '2026-11-05 23:06:02'),
(142, 72, 88, 316, 'Dompet Kartu Slim Navy', 'FKU-DOMP88-ORIGINAL', 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&h=900&q=80', 119000.00, 1, '2026-11-05 17:35:02', '2026-11-05 17:35:02'),
(143, 72, 13, 46, 'Kemeja Linen Oversize Khaki', 'FKU-KEME13-M', 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&h=900&q=80', 289000.00, 2, '2026-11-05 17:35:02', '2026-11-05 17:35:02'),
(144, 72, 23, 82, 'Jaket Kanvas Kerja Cokelat', 'FKU-JAKE23-XL', 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=900&h=900&q=80', 429000.00, 1, '2026-11-05 17:35:02', '2026-11-05 17:35:02'),
(145, 73, 13, 46, 'Kemeja Linen Oversize Khaki', 'FKU-KEME13-M', 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&h=900&q=80', 289000.00, 2, '2026-11-05 12:04:02', '2026-11-05 12:04:02'),
(146, 74, 13, 46, 'Kemeja Linen Oversize Khaki', 'FKU-KEME13-M', 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&h=900&q=80', 289000.00, 1, '2026-11-05 06:33:02', '2026-11-05 06:33:02'),
(147, 74, 17, 61, 'Kemeja Twill Asimetri Navy', 'FKU-KEME17-M', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&h=900&q=80', 219000.00, 1, '2026-11-05 06:33:02', '2026-11-05 06:33:02'),
(148, 75, 13, 46, 'Kemeja Linen Oversize Khaki', 'FKU-KEME13-M', 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&h=900&q=80', 289000.00, 1, '2026-11-05 01:02:02', '2026-11-05 01:02:02'),
(149, 75, 21, 74, 'Jaket Bomber Ripstop Hitam', 'FKU-JAKE21-M', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&h=900&q=80', 459000.00, 2, '2026-11-05 01:02:02', '2026-11-05 01:02:02'),
(150, 75, 32, 124, 'Dress Midi Linen Krem', 'FKU-DRES32-M', 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&h=900&q=80', 279000.00, 1, '2026-11-05 01:02:02', '2026-11-05 01:02:02'),
(151, 76, 13, 46, 'Kemeja Linen Oversize Khaki', 'FKU-KEME13-M', 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&h=900&q=80', 289000.00, 2, '2026-11-04 19:31:02', '2026-11-04 19:31:02'),
(152, 77, 15, 53, 'Kemeja Batik Lengan Panjang Parang', 'FKU-KEME15-S', 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=900&h=900&q=80', 349000.00, 1, '2026-11-04 14:00:02', '2026-11-04 14:00:02'),
(153, 77, 27, 100, 'Celana Cargo Ripstop Olive', 'FKU-CELA27-31', 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&h=900&q=80', 299000.00, 1, '2026-11-04 14:00:02', '2026-11-04 14:00:02'),
(154, 78, 19, 66, 'Jaket Denim Oversize Blue Washed', 'FKU-JAKE19-S', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&h=900&q=80', 329000.00, 1, '2026-11-04 08:29:02', '2026-11-04 08:29:02'),
(155, 78, 30, 116, 'Celana Panjang Kanvas Cokelat', 'FKU-CELA30-34', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&h=900&q=80', 279000.00, 2, '2026-11-04 08:29:02', '2026-11-04 08:29:02'),
(156, 78, 44, 166, 'Blus Crop Boxy Cotton Pink', 'FKU-BLUS44-S', 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=900&h=900&q=80', 139000.00, 1, '2026-11-04 08:29:02', '2026-11-04 08:29:02'),
(157, 79, 22, 79, 'Jaket Hiking Softshell Abu', 'FKU-JAKE22-XL', 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=900&h=900&q=80', 499000.00, 2, '2026-11-04 02:58:02', '2026-11-04 02:58:02'),
(158, 80, 25, 92, 'Celana Chino Slim Fit Khaki', 'FKU-CELA25-33', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&h=900&q=80', 199000.00, 1, '2026-11-03 21:27:02', '2026-11-03 21:27:02'),
(159, 80, 38, 145, 'Dress Sundress Tiered Gingham', 'FKU-DRES38-M', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&h=900&q=80', 199000.00, 1, '2026-11-03 21:27:02', '2026-11-03 21:27:02'),
(160, 81, 28, 105, 'Celana Formal Wool Blend Hitam', 'FKU-CELA28-30', 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=900&h=900&q=80', 459000.00, 1, '2026-11-03 15:56:02', '2026-11-03 15:56:02'),
(161, 81, 42, 158, 'Blus Kerah Peter Pan Putih', 'FKU-BLUS42-S', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&h=900&q=80', 219000.00, 2, '2026-11-03 15:56:02', '2026-11-03 15:56:02'),
(162, 81, 54, 205, 'Blazer Oversized Linen Oat', 'FKU-OUTE54-XL', 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=900&h=900&q=80', 359000.00, 1, '2026-11-03 15:56:02', '2026-11-03 15:56:02'),
(163, 82, 31, 121, 'Celana Jeans Slim Stretch Black', 'FKU-CELA31-33', 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&h=900&q=80', 289000.00, 2, '2026-11-03 10:25:02', '2026-11-03 10:25:02'),
(164, 83, 35, 134, 'Dress Shirt Midi Denim Light', 'FKU-DRES35-M', 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&h=900&q=80', 349000.00, 1, '2026-11-03 04:54:02', '2026-11-03 04:54:02'),
(165, 83, 49, 184, 'Rok Plisket Midi Hitam', 'FKU-ROK49-M', 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&h=900&q=80', 189000.00, 1, '2026-11-03 04:54:02', '2026-11-03 04:54:02'),
(166, 84, 39, 150, 'Dress Kemeja Midi Khaki', 'FKU-DRES39-XL', 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&h=900&q=80', 319000.00, 1, '2026-11-02 23:23:02', '2026-11-02 23:23:02'),
(167, 84, 52, 197, 'Rok Linen Panjang Sage', 'FKU-ROK52-XL', 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&h=900&q=80', 239000.00, 2, '2026-11-02 23:23:02', '2026-11-02 23:23:02'),
(168, 84, 64, 248, 'Boots Chelsea Kulit Cokelat', 'FKU-SEPA64-42', 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&h=900&q=80', 499000.00, 1, '2026-11-02 23:23:02', '2026-11-02 23:23:02'),
(169, 85, 43, 163, 'Blus Oversized Poplin Navy', 'FKU-BLUS43-M', 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&h=900&q=80', 229000.00, 2, '2026-10-30 02:24:02', '2026-10-30 02:24:02'),
(170, 86, 47, 176, 'Blus Knit Cropped Cream', 'FKU-BLUS47-S', 'https://images.unsplash.com/photo-1496217590455-aa63a8350eea?auto=format&fit=crop&w=900&h=900&q=80', 189000.00, 1, '2026-10-29 00:13:02', '2026-10-29 00:13:02'),
(171, 86, 60, 227, 'Sneakers Chunky Retro Silver', 'FKU-SEPA60-40', 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=900&h=900&q=80', 449000.00, 1, '2026-10-29 00:13:02', '2026-10-29 00:13:02'),
(172, 87, 50, 189, 'Rok Denim A-Line Mid Blue', 'FKU-ROK50-L', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&h=900&q=80', 269000.00, 1, '2026-10-27 22:02:02', '2026-10-27 22:02:02'),
(173, 87, 62, 240, 'Loafers Kulit Sintetis Cokelat', 'FKU-SEPA62-43', 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&h=900&q=80', 379000.00, 2, '2026-10-27 22:02:02', '2026-10-27 22:02:02'),
(174, 87, 71, 287, 'Sandal Slide Puffy Hitam', 'FKU-SAND71-44', 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=900&h=900&q=80', 119000.00, 1, '2026-10-27 22:02:02', '2026-10-27 22:02:02'),
(175, 88, 54, 202, 'Blazer Oversized Linen Oat', 'FKU-OUTE54-S', 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=900&h=900&q=80', 359000.00, 2, '2026-10-26 19:51:02', '2026-10-26 19:51:02'),
(176, 89, 57, 215, 'Bomber Satin Wanita Sage', 'FKU-OUTE57-L', 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=900&h=900&q=80', 379000.00, 1, '2026-10-25 17:40:02', '2026-10-25 17:40:02'),
(177, 89, 68, 266, 'Heels Blok Tali Hitam', 'FKU-SEPA68-36', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&h=900&q=80', 329000.00, 1, '2026-10-25 17:40:02', '2026-10-25 17:40:02'),
(178, 90, 61, 232, 'Sepatu Kulit Formal Oxford Hitam', 'FKU-SEPA61-41', 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=900&h=900&q=80', 649000.00, 1, '2026-10-24 15:29:02', '2026-10-24 15:29:02'),
(179, 90, 70, 279, 'Pantofel Wanita Nude', 'FKU-SEPA70-38', 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&h=900&q=80', 299000.00, 2, '2026-10-24 15:29:02', '2026-10-24 15:29:02'),
(180, 90, 19, 66, 'Jaket Denim Oversize Blue Washed', 'FKU-JAKE19-S', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&h=900&q=80', 329000.00, 1, '2026-10-24 15:29:02', '2026-10-24 15:29:02'),
(181, 91, 63, 245, 'Pantofel Kulit Asli Navy', 'FKU-SEPA63-44', 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?auto=format&fit=crop&w=900&h=900&q=80', 649000.00, 2, '2026-10-23 13:18:02', '2026-10-23 13:18:02'),
(182, 92, 66, 258, 'Sneakers Running Knit Abu', 'FKU-SEPA66-42', 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=900&h=900&q=80', 459000.00, 1, '2026-10-22 11:07:02', '2026-10-22 11:07:02'),
(183, 92, 82, 310, 'Tas Selempang Kulit Cokelat', 'FKU-TASS82-ORIGINAL', 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&h=900&q=80', 379000.00, 1, '2026-10-22 11:07:02', '2026-10-22 11:07:02'),
(184, 93, 69, 271, 'Sneakers Slip-On Denim', 'FKU-SEPA69-39', 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&h=900&q=80', 329000.00, 1, '2026-10-21 08:56:02', '2026-10-21 08:56:02'),
(185, 93, 96, 324, 'Kacamata Bulat Frame Emas', 'FKU-KACA96-ORIGINAL', 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&h=900&q=80', 329000.00, 2, '2026-10-21 08:56:02', '2026-10-21 08:56:02'),
(186, 93, 21, 73, 'Jaket Bomber Ripstop Hitam', 'FKU-JAKE21-S', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&h=900&q=80', 459000.00, 1, '2026-10-21 08:56:02', '2026-10-21 08:56:02'),
(187, 94, 71, 284, 'Sandal Slide Puffy Hitam', 'FKU-SAND71-41', 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=900&h=900&q=80', 119000.00, 2, '2026-10-20 06:45:02', '2026-10-20 06:45:02'),
(188, 95, 73, 297, 'Sandal Sport Outdoor Abu', 'FKU-SAND73-44', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&h=900&q=80', 249000.00, 1, '2026-10-19 04:34:02', '2026-10-19 04:34:02'),
(189, 95, 21, 73, 'Jaket Bomber Ripstop Hitam', 'FKU-JAKE21-S', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&h=900&q=80', 459000.00, 1, '2026-10-19 04:34:02', '2026-10-19 04:34:02'),
(190, 96, 88, 316, 'Dompet Kartu Slim Navy', 'FKU-DOMP88-ORIGINAL', 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&h=900&q=80', 119000.00, 1, '2026-10-18 02:23:02', '2026-10-18 02:23:02'),
(191, 96, 22, 77, 'Jaket Hiking Softshell Abu', 'FKU-JAKE22-M', 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=900&h=900&q=80', 499000.00, 2, '2026-10-18 02:23:02', '2026-10-18 02:23:02'),
(192, 96, 23, 82, 'Jaket Kanvas Kerja Cokelat', 'FKU-JAKE23-XL', 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=900&h=900&q=80', 429000.00, 1, '2026-10-18 02:23:02', '2026-10-18 02:23:02'),
(193, 97, 23, 80, 'Jaket Kanvas Kerja Cokelat', 'FKU-JAKE23-M', 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=900&h=900&q=80', 429000.00, 2, '2026-10-17 00:12:02', '2026-10-17 00:12:02'),
(194, 98, 23, 80, 'Jaket Kanvas Kerja Cokelat', 'FKU-JAKE23-M', 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=900&h=900&q=80', 429000.00, 1, '2026-10-15 22:01:02', '2026-10-15 22:01:02'),
(195, 98, 23, 80, 'Jaket Kanvas Kerja Cokelat', 'FKU-JAKE23-M', 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=900&h=900&q=80', 429000.00, 1, '2026-10-15 22:01:02', '2026-10-15 22:01:02'),
(196, 99, 24, 83, 'Jaket Harrington Cotton Navy', 'FKU-JAKE24-S', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&h=900&q=80', 319000.00, 1, '2026-10-14 19:50:02', '2026-10-14 19:50:02'),
(197, 99, 24, 83, 'Jaket Harrington Cotton Navy', 'FKU-JAKE24-S', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&h=900&q=80', 319000.00, 2, '2026-10-14 19:50:02', '2026-10-14 19:50:02'),
(198, 99, 32, 124, 'Dress Midi Linen Krem', 'FKU-DRES32-M', 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&h=900&q=80', 279000.00, 1, '2026-10-14 19:50:02', '2026-10-14 19:50:02'),
(199, 100, 24, 83, 'Jaket Harrington Cotton Navy', 'FKU-JAKE24-S', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&h=900&q=80', 319000.00, 2, '2026-10-13 17:39:02', '2026-10-13 17:39:02'),
(200, 101, 25, 87, 'Celana Chino Slim Fit Khaki', 'FKU-CELA25-28', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&h=900&q=80', 199000.00, 1, '2026-10-12 15:28:02', '2026-10-12 15:28:02'),
(201, 101, 27, 100, 'Celana Cargo Ripstop Olive', 'FKU-CELA27-31', 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&h=900&q=80', 299000.00, 1, '2026-10-12 15:28:02', '2026-10-12 15:28:02'),
(202, 102, 25, 87, 'Celana Chino Slim Fit Khaki', 'FKU-CELA25-28', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&h=900&q=80', 199000.00, 1, '2026-10-11 13:17:02', '2026-10-11 13:17:02'),
(203, 102, 30, 116, 'Celana Panjang Kanvas Cokelat', 'FKU-CELA30-34', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&h=900&q=80', 279000.00, 2, '2026-10-11 13:17:02', '2026-10-11 13:17:02'),
(204, 102, 44, 166, 'Blus Crop Boxy Cotton Pink', 'FKU-BLUS44-S', 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=900&h=900&q=80', 139000.00, 1, '2026-10-11 13:17:02', '2026-10-11 13:17:02'),
(205, 103, 26, 93, 'Celana Jeans Straight Leg Indigo', 'FKU-CELA26-29', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&h=900&q=80', 329000.00, 2, '2026-10-10 11:06:02', '2026-10-10 11:06:02'),
(206, 104, 26, 93, 'Celana Jeans Straight Leg Indigo', 'FKU-CELA26-29', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&h=900&q=80', 329000.00, 1, '2026-10-09 08:55:02', '2026-10-09 08:55:02'),
(207, 104, 38, 145, 'Dress Sundress Tiered Gingham', 'FKU-DRES38-M', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&h=900&q=80', 199000.00, 1, '2026-10-09 08:55:02', '2026-10-09 08:55:02'),
(208, 105, 28, 105, 'Celana Formal Wool Blend Hitam', 'FKU-CELA28-30', 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=900&h=900&q=80', 459000.00, 1, '2026-10-08 06:44:02', '2026-10-08 06:44:02'),
(209, 105, 42, 158, 'Blus Kerah Peter Pan Putih', 'FKU-BLUS42-S', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&h=900&q=80', 219000.00, 2, '2026-10-08 06:44:02', '2026-10-08 06:44:02'),
(210, 105, 54, 205, 'Blazer Oversized Linen Oat', 'FKU-OUTE54-XL', 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=900&h=900&q=80', 359000.00, 1, '2026-10-08 06:44:02', '2026-10-08 06:44:02'),
(211, 106, 31, 121, 'Celana Jeans Slim Stretch Black', 'FKU-CELA31-33', 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&h=900&q=80', 289000.00, 2, '2026-10-07 04:33:02', '2026-10-07 04:33:02'),
(212, 107, 35, 134, 'Dress Shirt Midi Denim Light', 'FKU-DRES35-M', 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&h=900&q=80', 349000.00, 1, '2026-10-06 02:22:02', '2026-10-06 02:22:02'),
(213, 107, 49, 184, 'Rok Plisket Midi Hitam', 'FKU-ROK49-M', 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&h=900&q=80', 189000.00, 1, '2026-10-06 02:22:02', '2026-10-06 02:22:02'),
(214, 108, 39, 150, 'Dress Kemeja Midi Khaki', 'FKU-DRES39-XL', 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&h=900&q=80', 319000.00, 1, '2026-10-05 00:11:02', '2026-10-05 00:11:02'),
(215, 108, 52, 197, 'Rok Linen Panjang Sage', 'FKU-ROK52-XL', 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&h=900&q=80', 239000.00, 2, '2026-10-05 00:11:02', '2026-10-05 00:11:02'),
(216, 108, 64, 248, 'Boots Chelsea Kulit Cokelat', 'FKU-SEPA64-42', 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&h=900&q=80', 499000.00, 1, '2026-10-05 00:11:02', '2026-10-05 00:11:02'),
(217, 109, 43, 163, 'Blus Oversized Poplin Navy', 'FKU-BLUS43-M', 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&h=900&q=80', 229000.00, 2, '2026-10-03 22:00:02', '2026-10-03 22:00:02'),
(218, 110, 47, 176, 'Blus Knit Cropped Cream', 'FKU-BLUS47-S', 'https://images.unsplash.com/photo-1496217590455-aa63a8350eea?auto=format&fit=crop&w=900&h=900&q=80', 189000.00, 1, '2026-10-02 19:49:02', '2026-10-02 19:49:02'),
(219, 110, 60, 227, 'Sneakers Chunky Retro Silver', 'FKU-SEPA60-40', 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=900&h=900&q=80', 449000.00, 1, '2026-10-02 19:49:02', '2026-10-02 19:49:02'),
(220, 111, 50, 189, 'Rok Denim A-Line Mid Blue', 'FKU-ROK50-L', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&h=900&q=80', 269000.00, 1, '2026-10-01 17:38:02', '2026-10-01 17:38:02');
INSERT INTO `order_items` (`id`, `sub_order_id`, `product_id`, `variant_id`, `product_name`, `sku`, `thumbnail`, `price`, `quantity`, `created_at`, `updated_at`) VALUES
(221, 111, 62, 240, 'Loafers Kulit Sintetis Cokelat', 'FKU-SEPA62-43', 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&h=900&q=80', 379000.00, 2, '2026-10-01 17:38:02', '2026-10-01 17:38:02'),
(222, 111, 71, 287, 'Sandal Slide Puffy Hitam', 'FKU-SAND71-44', 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=900&h=900&q=80', 119000.00, 1, '2026-10-01 17:38:02', '2026-10-01 17:38:02'),
(223, 112, 54, 202, 'Blazer Oversized Linen Oat', 'FKU-OUTE54-S', 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=900&h=900&q=80', 359000.00, 2, '2026-09-30 15:27:02', '2026-09-30 15:27:02'),
(224, 113, 57, 215, 'Bomber Satin Wanita Sage', 'FKU-OUTE57-L', 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=900&h=900&q=80', 379000.00, 1, '2026-09-29 13:16:02', '2026-09-29 13:16:02'),
(225, 113, 68, 266, 'Heels Blok Tali Hitam', 'FKU-SEPA68-36', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&h=900&q=80', 329000.00, 1, '2026-09-29 13:16:02', '2026-09-29 13:16:02'),
(226, 114, 61, 232, 'Sepatu Kulit Formal Oxford Hitam', 'FKU-SEPA61-41', 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=900&h=900&q=80', 649000.00, 1, '2026-09-28 11:05:02', '2026-09-28 11:05:02'),
(227, 114, 70, 279, 'Pantofel Wanita Nude', 'FKU-SEPA70-38', 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&h=900&q=80', 299000.00, 2, '2026-09-28 11:05:02', '2026-09-28 11:05:02'),
(228, 114, 32, 123, 'Dress Midi Linen Krem', 'FKU-DRES32-S', 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&h=900&q=80', 279000.00, 1, '2026-09-28 11:05:02', '2026-09-28 11:05:02'),
(229, 115, 63, 245, 'Pantofel Kulit Asli Navy', 'FKU-SEPA63-44', 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?auto=format&fit=crop&w=900&h=900&q=80', 649000.00, 2, '2026-09-27 08:54:02', '2026-09-27 08:54:02'),
(230, 116, 66, 258, 'Sneakers Running Knit Abu', 'FKU-SEPA66-42', 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=900&h=900&q=80', 459000.00, 1, '2026-09-26 06:43:02', '2026-09-26 06:43:02'),
(231, 116, 82, 310, 'Tas Selempang Kulit Cokelat', 'FKU-TASS82-ORIGINAL', 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&h=900&q=80', 379000.00, 1, '2026-09-26 06:43:02', '2026-09-26 06:43:02'),
(232, 117, 69, 271, 'Sneakers Slip-On Denim', 'FKU-SEPA69-39', 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&h=900&q=80', 329000.00, 1, '2026-09-25 04:32:02', '2026-09-25 04:32:02'),
(233, 117, 96, 324, 'Kacamata Bulat Frame Emas', 'FKU-KACA96-ORIGINAL', 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&h=900&q=80', 329000.00, 2, '2026-09-25 04:32:02', '2026-09-25 04:32:02'),
(234, 117, 33, 127, 'Dress Slip Satin Champagne', 'FKU-DRES33-S', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&h=900&q=80', 289000.00, 1, '2026-09-25 04:32:02', '2026-09-25 04:32:02'),
(235, 118, 71, 284, 'Sandal Slide Puffy Hitam', 'FKU-SAND71-41', 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=900&h=900&q=80', 119000.00, 2, '2026-09-24 02:21:02', '2026-09-24 02:21:02'),
(236, 119, 73, 297, 'Sandal Sport Outdoor Abu', 'FKU-SAND73-44', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&h=900&q=80', 249000.00, 1, '2026-09-23 00:10:02', '2026-09-23 00:10:02'),
(237, 119, 35, 134, 'Dress Shirt Midi Denim Light', 'FKU-DRES35-M', 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&h=900&q=80', 349000.00, 1, '2026-09-23 00:10:02', '2026-09-23 00:10:02'),
(238, 120, 88, 316, 'Dompet Kartu Slim Navy', 'FKU-DOMP88-ORIGINAL', 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&h=900&q=80', 119000.00, 1, '2026-09-21 21:59:02', '2026-09-21 21:59:02'),
(239, 120, 35, 134, 'Dress Shirt Midi Denim Light', 'FKU-DRES35-M', 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&h=900&q=80', 349000.00, 2, '2026-09-21 21:59:02', '2026-09-21 21:59:02'),
(240, 120, 35, 134, 'Dress Shirt Midi Denim Light', 'FKU-DRES35-M', 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&h=900&q=80', 349000.00, 1, '2026-09-21 21:59:02', '2026-09-21 21:59:02'),
(241, 121, 36, 137, 'Dress Maxi Katun Batik Parang', 'FKU-DRES36-S', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&h=900&q=80', 359000.00, 2, '2026-09-20 19:48:02', '2026-09-20 19:48:02'),
(242, 122, 36, 137, 'Dress Maxi Katun Batik Parang', 'FKU-DRES36-S', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&h=900&q=80', 359000.00, 1, '2026-09-19 17:37:02', '2026-09-19 17:37:02'),
(243, 122, 36, 137, 'Dress Maxi Katun Batik Parang', 'FKU-DRES36-S', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&h=900&q=80', 359000.00, 1, '2026-09-19 17:37:02', '2026-09-19 17:37:02'),
(244, 123, 38, 144, 'Dress Sundress Tiered Gingham', 'FKU-DRES38-S', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&h=900&q=80', 199000.00, 1, '2026-09-18 15:26:02', '2026-09-18 15:26:02'),
(245, 123, 38, 144, 'Dress Sundress Tiered Gingham', 'FKU-DRES38-S', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&h=900&q=80', 199000.00, 2, '2026-09-18 15:26:02', '2026-09-18 15:26:02'),
(246, 123, 38, 144, 'Dress Sundress Tiered Gingham', 'FKU-DRES38-S', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&h=900&q=80', 199000.00, 1, '2026-09-18 15:26:02', '2026-09-18 15:26:02'),
(247, 124, 38, 144, 'Dress Sundress Tiered Gingham', 'FKU-DRES38-S', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&h=900&q=80', 199000.00, 2, '2026-09-17 13:15:02', '2026-09-17 13:15:02'),
(248, 125, 38, 144, 'Dress Sundress Tiered Gingham', 'FKU-DRES38-S', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&h=900&q=80', 199000.00, 1, '2026-09-16 11:04:02', '2026-09-16 11:04:02'),
(249, 125, 38, 144, 'Dress Sundress Tiered Gingham', 'FKU-DRES38-S', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&h=900&q=80', 199000.00, 1, '2026-09-16 11:04:02', '2026-09-16 11:04:02'),
(250, 126, 38, 144, 'Dress Sundress Tiered Gingham', 'FKU-DRES38-S', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&h=900&q=80', 199000.00, 1, '2026-09-15 08:53:02', '2026-09-15 08:53:02'),
(251, 126, 38, 144, 'Dress Sundress Tiered Gingham', 'FKU-DRES38-S', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&h=900&q=80', 199000.00, 2, '2026-09-15 08:53:02', '2026-09-15 08:53:02'),
(252, 126, 44, 166, 'Blus Crop Boxy Cotton Pink', 'FKU-BLUS44-S', 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=900&h=900&q=80', 139000.00, 1, '2026-09-15 08:53:02', '2026-09-15 08:53:02'),
(253, 127, 39, 147, 'Dress Kemeja Midi Khaki', 'FKU-DRES39-S', 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&h=900&q=80', 319000.00, 2, '2026-09-14 06:42:02', '2026-09-14 06:42:02'),
(254, 128, 40, 151, 'Dress Off Shoulder Ruffle Terracotta', 'FKU-DRES40-S', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&h=900&q=80', 259000.00, 1, '2026-09-13 04:31:02', '2026-09-13 04:31:02'),
(255, 128, 40, 151, 'Dress Off Shoulder Ruffle Terracotta', 'FKU-DRES40-S', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&h=900&q=80', 259000.00, 1, '2026-09-13 04:31:02', '2026-09-13 04:31:02'),
(256, 129, 40, 151, 'Dress Off Shoulder Ruffle Terracotta', 'FKU-DRES40-S', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&h=900&q=80', 259000.00, 1, '2026-09-12 02:20:02', '2026-09-12 02:20:02'),
(257, 129, 42, 158, 'Blus Kerah Peter Pan Putih', 'FKU-BLUS42-S', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&h=900&q=80', 219000.00, 2, '2026-09-12 02:20:02', '2026-09-12 02:20:02'),
(258, 129, 54, 205, 'Blazer Oversized Linen Oat', 'FKU-OUTE54-XL', 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=900&h=900&q=80', 359000.00, 1, '2026-09-12 02:20:02', '2026-09-12 02:20:02'),
(259, 130, 41, 154, 'Blus Ruffle Satin Ivory', 'FKU-BLUS41-S', 'https://images.unsplash.com/photo-1496217590455-aa63a8350eea?auto=format&fit=crop&w=900&h=900&q=80', 209000.00, 2, '2026-09-11 00:09:02', '2026-09-11 00:09:02'),
(260, 131, 41, 154, 'Blus Ruffle Satin Ivory', 'FKU-BLUS41-S', 'https://images.unsplash.com/photo-1496217590455-aa63a8350eea?auto=format&fit=crop&w=900&h=900&q=80', 209000.00, 1, '2026-09-09 21:58:02', '2026-09-09 21:58:02'),
(261, 131, 49, 184, 'Rok Plisket Midi Hitam', 'FKU-ROK49-M', 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&h=900&q=80', 189000.00, 1, '2026-09-09 21:58:02', '2026-09-09 21:58:02'),
(262, 132, 42, 158, 'Blus Kerah Peter Pan Putih', 'FKU-BLUS42-S', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&h=900&q=80', 219000.00, 1, '2026-09-08 19:47:02', '2026-09-08 19:47:02'),
(263, 132, 52, 197, 'Rok Linen Panjang Sage', 'FKU-ROK52-XL', 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&h=900&q=80', 239000.00, 2, '2026-09-08 19:47:02', '2026-09-08 19:47:02'),
(264, 132, 64, 248, 'Boots Chelsea Kulit Cokelat', 'FKU-SEPA64-42', 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&h=900&q=80', 499000.00, 1, '2026-09-08 19:47:02', '2026-09-08 19:47:02');

-- --------------------------------------------------------

--
-- Table structure for table `otp_challenges`
--

CREATE TABLE `otp_challenges` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `purpose` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL DEFAULT '0',
  `max_attempts` smallint UNSIGNED NOT NULL DEFAULT '5',
  `expires_at` timestamp NOT NULL,
  `consumed_at` timestamp NULL DEFAULT NULL,
  `challenge_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `metadata` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `otp_challenges`
--

INSERT INTO `otp_challenges` (`id`, `user_id`, `email`, `phone`, `purpose`, `code_hash`, `attempts`, `max_attempts`, `expires_at`, `consumed_at`, `challenge_id`, `ip_address`, `user_agent`, `metadata`, `created_at`, `updated_at`, `deleted_at`) VALUES
('230be209-6079-45ce-bf00-eba5f7f680c1', '7c5ee92d-2adf-4963-9a6e-9dc1ff30be6f', 'akbarfahlevy39@gmail.com', NULL, 'google_login', '$2y$12$S/37A9wFV/ElfuulzXQ8COX/gumAtg3K4WPn7S7.F28Tp7cCZlGTG', 0, 5, '2026-11-14 04:05:38', NULL, '8f96349f-e436-49de-95ae-583a4a8c0629', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36', '{\"role\": \"buyer\", \"login_type\": \"google\", \"device_name\": \"marketplace-web-buyer\"}', '2026-11-14 04:00:38', '2026-11-14 04:00:38', NULL),
('9b15aafc-1819-4cc7-b3a7-deb5363bd891', NULL, 'akbarfahlevy39@gmail.com', NULL, 'register', '$2y$12$AbaJJHTJNNKX4r2uAnPB9OkwU7s.SFT/Tf3OrSBReXGeDb6t1iUJW', 0, 5, '2026-11-14 04:03:48', '2026-11-14 03:59:02', '2fb52619-d321-46fc-a5ec-773d40d544a1', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36', '{\"challenge_id\": \"2fb52619-d321-46fc-a5ec-773d40d544a1\", \"registration_challenge_id\": \"43a98fcd-c27d-41a1-8f08-ed488018926c\"}', '2026-11-14 03:58:48', '2026-11-14 03:59:02', NULL),
('d9544f01-53e2-4f81-a4a8-0458fdce9c9e', '7c5ee92d-2adf-4963-9a6e-9dc1ff30be6f', 'akbarfahlevy39@gmail.com', NULL, 'google_login', '$2y$12$8r12KsO9Zq1SXRR9A0vvvetD6HHs96zt2aIGch4HTV/75BQn9cSly', 0, 5, '2026-11-14 04:06:43', NULL, '6af4cde0-7aca-41ab-af64-a908bac0b904', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36', '{\"role\": \"buyer\", \"login_type\": \"google\", \"device_name\": \"marketplace-web-buyer\"}', '2026-11-14 04:01:43', '2026-11-14 04:01:43', NULL),
('d97a9b59-063d-41d5-8199-0990cea428da', NULL, 'akbarfahlevy39@gmail.com', NULL, 'register', '$2y$12$qyZmjQtoGrG6OHnV0kitzu7j7ThIpo9OAA78F9/twvfbruNwAaWte', 0, 5, '2026-11-14 04:04:02', NULL, '2fb52619-d321-46fc-a5ec-773d40d544a1', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36', '{\"challenge_id\": \"2fb52619-d321-46fc-a5ec-773d40d544a1\", \"registration_challenge_id\": \"43a98fcd-c27d-41a1-8f08-ed488018926c\"}', '2026-11-14 03:59:02', '2026-11-14 03:59:02', NULL),
('fce49ac4-af91-454a-b436-868acfc79051', NULL, 'akbarfahlevy39@gmail.com', NULL, 'register', '$2y$12$PhRxDC3V0ALbn/S8ezEokO3HFWnTnq6QhzRNS9oupuAGSYmYe93oe', 0, 5, '2026-11-14 04:08:19', '2026-11-14 03:58:48', '2fb52619-d321-46fc-a5ec-773d40d544a1', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36', '{\"challenge_id\": \"2fb52619-d321-46fc-a5ec-773d40d544a1\", \"registration_challenge_id\": \"43a98fcd-c27d-41a1-8f08-ed488018926c\"}', '2026-11-14 03:58:19', '2026-11-14 03:58:48', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` bigint UNSIGNED NOT NULL,
  `order_number` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `transaction_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_method` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `payload` longtext COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `order_number`, `transaction_id`, `payment_method`, `amount`, `status`, `payload`, `created_at`, `updated_at`) VALUES
(1, 'FKU-20261114-9000', 'TRX-FKU-20261114-9000', 'midtrans', 196000.00, 'pending', '{\"provider\":\"midtrans\",\"status_code\":\"201\",\"paid_at\":null}', '2026-11-14 02:20:02', '2026-11-14 02:23:02'),
(2, 'FKU-20261114-9001', 'TRX-FKU-20261114-9001', 'bank_transfer', 338000.00, 'pending', '{\"provider\":\"bank_transfer\",\"status_code\":\"201\",\"paid_at\":null}', '2026-11-14 02:13:02', '2026-11-14 02:17:02'),
(3, 'FKU-20261114-9002', 'TRX-FKU-20261114-9002', 'ewallet', 1386000.00, 'pending', '{\"provider\":\"ewallet\",\"status_code\":\"201\",\"paid_at\":null}', '2026-11-14 02:05:02', '2026-11-14 02:10:02'),
(4, 'FKU-20261114-9003', 'TRX-FKU-20261114-9003', 'qris', 378000.00, 'expire', '{\"provider\":\"qris\",\"status_code\":\"201\",\"paid_at\":null}', '2026-11-14 01:57:02', '2026-11-14 02:11:02'),
(5, 'FKU-20261114-9004', 'TRX-FKU-20261114-9004', 'midtrans', 648000.00, 'pending', '{\"provider\":\"midtrans\",\"status_code\":\"201\",\"paid_at\":null}', '2026-11-14 01:46:02', '2026-11-14 01:53:02'),
(6, 'FKU-20261114-9005', 'TRX-FKU-20261114-9005', 'bank_transfer', 1026000.00, 'pending', '{\"provider\":\"bank_transfer\",\"status_code\":\"201\",\"paid_at\":null}', '2026-11-14 01:32:02', '2026-11-14 01:40:02'),
(7, 'FKU-20261114-9006', 'TRX-FKU-20261114-9006', 'ewallet', 898000.00, 'settlement', '{\"provider\":\"ewallet\",\"status_code\":\"200\",\"paid_at\":\"2026-11-14 08:23:02\"}', '2026-11-14 01:18:02', '2026-11-14 01:27:02'),
(8, 'FKU-20261114-9007', 'TRX-FKU-20261114-9007', 'qris', 398000.00, 'pending', '{\"provider\":\"qris\",\"status_code\":\"201\",\"paid_at\":null}', '2026-11-14 01:01:02', '2026-11-14 01:11:02'),
(9, 'FKU-20261114-9008', 'TRX-FKU-20261114-9008', 'midtrans', 1256000.00, 'pending', '{\"provider\":\"midtrans\",\"status_code\":\"201\",\"paid_at\":null}', '2026-11-14 00:47:02', '2026-11-14 00:58:02'),
(10, 'FKU-20261114-9009', 'TRX-FKU-20261114-9009', 'bank_transfer', 578000.00, 'settlement', '{\"provider\":\"bank_transfer\",\"status_code\":\"200\",\"paid_at\":\"2026-11-14 07:34:02\"}', '2026-11-14 00:29:02', '2026-11-14 00:41:02'),
(11, 'FKU-20261114-9010', 'TRX-FKU-20261114-9010', 'ewallet', 538000.00, 'pending', '{\"provider\":\"ewallet\",\"status_code\":\"201\",\"paid_at\":null}', '2026-11-14 00:10:02', '2026-11-14 00:23:02'),
(12, 'FKU-20261114-9011', 'TRX-FKU-20261114-9011', 'qris', 1296000.00, 'pending', '{\"provider\":\"qris\",\"status_code\":\"201\",\"paid_at\":null}', '2026-11-13 23:48:02', '2026-11-14 00:02:02'),
(13, 'FKU-20261114-9012', 'TRX-FKU-20261114-9012', 'midtrans', 428000.00, 'settlement', '{\"provider\":\"midtrans\",\"status_code\":\"200\",\"paid_at\":\"2026-11-14 06:24:02\"}', '2026-11-13 23:19:02', '2026-11-13 23:34:02'),
(14, 'FKU-20261114-9013', 'TRX-FKU-20261114-9013', 'bank_transfer', 638000.00, 'settlement', '{\"provider\":\"bank_transfer\",\"status_code\":\"200\",\"paid_at\":\"2026-11-14 05:49:02\"}', '2026-11-13 22:44:02', '2026-11-13 23:00:02'),
(15, 'FKU-20261114-9014', 'TRX-FKU-20261114-9014', 'ewallet', 1146000.00, 'settlement', '{\"provider\":\"ewallet\",\"status_code\":\"200\",\"paid_at\":\"2026-11-14 05:04:02\"}', '2026-11-13 21:59:02', '2026-11-13 22:16:02'),
(16, 'FKU-20261114-9015', 'TRX-FKU-20261114-9015', 'qris', 718000.00, 'settlement', '{\"provider\":\"qris\",\"status_code\":\"200\",\"paid_at\":\"2026-11-14 04:19:02\"}', '2026-11-13 21:14:02', '2026-11-13 23:34:02'),
(17, 'FKU-20261114-9016', 'TRX-FKU-20261114-9016', 'midtrans', 708000.00, 'settlement', '{\"provider\":\"midtrans\",\"status_code\":\"200\",\"paid_at\":\"2026-11-14 03:29:02\"}', '2026-11-13 20:24:02', '2026-11-13 20:43:02'),
(18, 'FKU-20261114-9017', 'TRX-FKU-20261114-9017', 'bank_transfer', 1376000.00, 'settlement', '{\"provider\":\"bank_transfer\",\"status_code\":\"200\",\"paid_at\":\"2026-11-14 02:34:02\"}', '2026-11-13 19:29:02', '2026-11-13 19:49:02'),
(19, 'FKU-20261114-9018', 'TRX-FKU-20261114-9018', 'ewallet', 1223000.00, 'settlement', '{\"provider\":\"ewallet\",\"status_code\":\"200\",\"paid_at\":\"2026-11-14 01:39:02\"}', '2026-11-13 18:34:02', '2026-11-13 18:55:02'),
(20, 'FKU-20261114-9019', 'TRX-FKU-20261114-9019', 'qris', 838000.00, 'settlement', '{\"provider\":\"qris\",\"status_code\":\"200\",\"paid_at\":\"2026-11-14 00:29:02\"}', '2026-11-13 17:24:02', '2026-11-13 17:46:02'),
(21, 'FKU-20261113-9020', 'TRX-FKU-20261113-9020', 'midtrans', 1246000.00, 'settlement', '{\"provider\":\"midtrans\",\"status_code\":\"200\",\"paid_at\":\"2026-11-13 23:19:02\"}', '2026-11-13 16:14:02', '2026-11-13 23:21:02'),
(22, 'FKU-20261113-9021', 'TRX-FKU-20261113-9021', 'bank_transfer', 262000.00, 'settlement', '{\"provider\":\"bank_transfer\",\"status_code\":\"200\",\"paid_at\":\"2026-11-13 21:59:02\"}', '2026-11-13 14:54:02', '2026-11-13 20:05:02'),
(23, 'FKU-20261113-9022', 'TRX-FKU-20261113-9022', 'ewallet', 418000.00, 'settlement', '{\"provider\":\"ewallet\",\"status_code\":\"200\",\"paid_at\":\"2026-11-13 20:29:02\"}', '2026-11-13 13:24:02', '2026-11-13 19:15:02'),
(24, 'FKU-20261113-9023', 'TRX-FKU-20261113-9023', 'qris', 706000.00, 'settlement', '{\"provider\":\"qris\",\"status_code\":\"200\",\"paid_at\":\"2026-11-13 18:59:02\"}', '2026-11-13 11:54:02', '2026-11-13 18:26:02'),
(25, 'FKU-20261113-9024', 'TRX-FKU-20261113-9024', 'midtrans', 255000.00, 'settlement', '{\"provider\":\"midtrans\",\"status_code\":\"200\",\"paid_at\":\"2026-11-13 17:29:02\"}', '2026-11-13 10:24:02', '2026-11-13 21:36:02'),
(26, 'FKU-20261113-9025', 'TRX-FKU-20261113-9025', 'bank_transfer', 308000.00, 'settlement', '{\"provider\":\"bank_transfer\",\"status_code\":\"200\",\"paid_at\":\"2026-11-13 15:29:02\"}', '2026-11-13 08:24:02', '2026-11-13 16:30:02'),
(27, 'FKU-20261113-9026', 'TRX-FKU-20261113-9026', 'ewallet', 1386000.00, 'settlement', '{\"provider\":\"ewallet\",\"status_code\":\"200\",\"paid_at\":\"2026-11-13 13:29:02\"}', '2026-11-13 06:24:02', '2026-11-13 15:24:02'),
(28, 'FKU-20261113-9027', 'TRX-FKU-20261113-9027', 'qris', 378000.00, 'settlement', '{\"provider\":\"qris\",\"status_code\":\"200\",\"paid_at\":\"2026-11-13 11:29:02\"}', '2026-11-13 04:24:02', '2026-11-13 14:18:02'),
(29, 'FKU-20261113-9028', 'TRX-FKU-20261113-9028', 'midtrans', 648000.00, 'settlement', '{\"provider\":\"midtrans\",\"status_code\":\"200\",\"paid_at\":\"2026-11-13 09:29:02\"}', '2026-11-13 02:24:02', '2026-11-13 13:12:02'),
(30, 'FKU-20261113-9029', 'TRX-FKU-20261113-9029', 'bank_transfer', 1026000.00, 'settlement', '{\"provider\":\"bank_transfer\",\"status_code\":\"200\",\"paid_at\":\"2026-11-13 07:12:02\"}', '2026-11-13 00:07:02', '2026-11-13 11:57:02'),
(31, 'FKU-20261113-9030', 'TRX-FKU-20261113-9030', 'ewallet', 898000.00, 'settlement', '{\"provider\":\"ewallet\",\"status_code\":\"200\",\"paid_at\":\"2026-11-13 04:55:02\"}', '2026-11-12 21:50:02', '2026-11-13 17:50:02'),
(32, 'FKU-20261113-9031', 'TRX-FKU-20261113-9031', 'qris', 398000.00, 'settlement', '{\"provider\":\"qris\",\"status_code\":\"200\",\"paid_at\":\"2026-11-13 02:38:02\"}', '2026-11-12 19:33:02', '2026-11-13 09:26:02'),
(33, 'FKU-20261113-9032', 'TRX-FKU-20261113-9032', 'midtrans', 1256000.00, 'settlement', '{\"provider\":\"midtrans\",\"status_code\":\"200\",\"paid_at\":\"2026-11-13 00:21:02\"}', '2026-11-12 17:16:02', '2026-11-13 08:11:02'),
(34, 'FKU-20261112-9033', 'TRX-FKU-20261112-9033', 'bank_transfer', 578000.00, 'settlement', '{\"provider\":\"bank_transfer\",\"status_code\":\"200\",\"paid_at\":\"2026-11-12 22:04:02\"}', '2026-11-12 14:59:02', '2026-11-13 15:47:02'),
(35, 'FKU-20261112-9034', 'TRX-FKU-20261112-9034', 'ewallet', 538000.00, 'settlement', '{\"provider\":\"ewallet\",\"status_code\":\"200\",\"paid_at\":\"2026-11-12 19:47:02\"}', '2026-11-12 12:42:02', '2026-11-13 05:40:02'),
(36, 'FKU-20261112-9035', 'TRX-FKU-20261112-9035', 'qris', 1296000.00, 'settlement', '{\"provider\":\"qris\",\"status_code\":\"200\",\"paid_at\":\"2026-11-12 17:30:02\"}', '2026-11-12 10:25:02', '2026-11-13 04:25:02'),
(37, 'FKU-20261112-9036', 'TRX-FKU-20261112-9036', 'midtrans', 458000.00, 'settlement', '{\"provider\":\"midtrans\",\"status_code\":\"200\",\"paid_at\":\"2026-11-12 15:13:02\"}', '2026-11-12 08:08:02', '2026-11-13 13:43:02'),
(38, 'FKU-20261112-9037', 'TRX-FKU-20261112-9037', 'bank_transfer', 638000.00, 'settlement', '{\"provider\":\"bank_transfer\",\"status_code\":\"200\",\"paid_at\":\"2026-11-12 12:56:02\"}', '2026-11-12 05:51:02', '2026-11-13 01:54:02'),
(39, 'FKU-20261112-9038', 'TRX-FKU-20261112-9038', 'ewallet', 1146000.00, 'settlement', '{\"provider\":\"ewallet\",\"status_code\":\"200\",\"paid_at\":\"2026-11-12 10:39:02\"}', '2026-11-12 03:34:02', '2026-11-13 00:39:02'),
(40, 'FKU-20261112-9039', 'TRX-FKU-20261112-9039', 'qris', 718000.00, 'settlement', '{\"provider\":\"qris\",\"status_code\":\"200\",\"paid_at\":\"2026-11-12 08:22:02\"}', '2026-11-12 01:17:02', '2026-11-13 11:40:02'),
(41, 'FKU-20261112-9040', 'TRX-FKU-20261112-9040', 'midtrans', 708000.00, 'settlement', '{\"provider\":\"midtrans\",\"status_code\":\"200\",\"paid_at\":\"2026-11-12 06:05:02\"}', '2026-11-11 23:00:02', '2026-11-12 22:08:02'),
(42, 'FKU-20261112-9041', 'TRX-FKU-20261112-9041', 'bank_transfer', 1326000.00, 'settlement', '{\"provider\":\"bank_transfer\",\"status_code\":\"200\",\"paid_at\":\"2026-11-12 03:48:02\"}', '2026-11-11 20:43:02', '2026-11-12 20:52:02'),
(43, 'FKU-20261112-9042', 'TRX-FKU-20261112-9042', 'ewallet', 1223000.00, 'settlement', '{\"provider\":\"ewallet\",\"status_code\":\"200\",\"paid_at\":\"2026-11-12 01:31:02\"}', '2026-11-11 18:26:02', '2026-11-13 09:37:02'),
(44, 'FKU-20261111-9043', 'TRX-FKU-20261111-9043', 'qris', 838000.00, 'settlement', '{\"provider\":\"qris\",\"status_code\":\"200\",\"paid_at\":\"2026-11-11 23:14:02\"}', '2026-11-11 16:09:02', '2026-11-12 18:22:02'),
(45, 'FKU-20261111-9044', 'TRX-FKU-20261111-9044', 'midtrans', 1246000.00, 'settlement', '{\"provider\":\"midtrans\",\"status_code\":\"200\",\"paid_at\":\"2026-11-11 20:57:02\"}', '2026-11-11 13:52:02', '2026-11-12 17:06:02'),
(46, 'FKU-20261111-9045', 'TRX-FKU-20261111-9045', 'bank_transfer', 256000.00, 'settlement', '{\"provider\":\"bank_transfer\",\"status_code\":\"200\",\"paid_at\":\"2026-11-11 18:40:02\"}', '2026-11-11 11:35:02', '2026-11-13 07:33:02'),
(47, 'FKU-20261111-9046', 'TRX-FKU-20261111-9046', 'ewallet', 328000.00, 'settlement', '{\"provider\":\"ewallet\",\"status_code\":\"200\",\"paid_at\":\"2026-11-11 16:23:02\"}', '2026-11-11 09:18:02', '2026-11-12 14:36:02'),
(48, 'FKU-20261111-9047', 'TRX-FKU-20261111-9047', 'qris', 706000.00, 'settlement', '{\"provider\":\"qris\",\"status_code\":\"200\",\"paid_at\":\"2026-11-11 14:06:02\"}', '2026-11-11 07:01:02', '2026-11-12 13:20:02'),
(49, 'FKU-20261111-9048', 'TRX-FKU-20261111-9048', 'midtrans', 174000.00, 'settlement', '{\"provider\":\"midtrans\",\"status_code\":\"200\",\"paid_at\":\"2026-11-11 11:49:02\"}', '2026-11-11 04:44:02', '2026-11-13 05:30:02'),
(50, 'FKU-20261111-9049', 'TRX-FKU-20261111-9049', 'bank_transfer', 340000.00, 'settlement', '{\"provider\":\"bank_transfer\",\"status_code\":\"200\",\"paid_at\":\"2026-11-11 09:32:02\"}', '2026-11-11 02:27:02', '2026-11-12 10:50:02'),
(51, 'FKU-20261111-9050', 'TRX-FKU-20261111-9050', 'ewallet', 1276000.00, 'settlement', '{\"provider\":\"ewallet\",\"status_code\":\"200\",\"paid_at\":\"2026-11-11 07:15:02\"}', '2026-11-11 00:10:02', '2026-11-13 04:08:02'),
(52, 'FKU-20261111-9051', 'TRX-FKU-20261111-9051', 'qris', 378000.00, 'settlement', '{\"provider\":\"qris\",\"status_code\":\"200\",\"paid_at\":\"2026-11-11 04:58:02\"}', '2026-11-10 21:53:02', '2026-11-13 03:27:02'),
(53, 'FKU-20261110-9052', 'TRX-FKU-20261110-9052', 'midtrans', 648000.00, 'settlement', '{\"provider\":\"midtrans\",\"status_code\":\"200\",\"paid_at\":\"2026-11-10 09:29:02\"}', '2026-11-10 02:24:02', '2026-11-13 12:00:02'),
(54, 'FKU-20261110-9053', 'TRX-FKU-20261110-9053', 'bank_transfer', 1026000.00, 'settlement', '{\"provider\":\"bank_transfer\",\"status_code\":\"200\",\"paid_at\":\"2026-11-10 03:58:02\"}', '2026-11-09 20:53:02', '2026-11-12 19:57:02'),
(55, 'FKU-20261109-9054', 'TRX-FKU-20261109-9054', 'ewallet', 998000.00, 'expire', '{\"provider\":\"ewallet\",\"status_code\":\"201\",\"paid_at\":null}', '2026-11-09 15:22:02', '2026-11-10 23:29:02'),
(56, 'FKU-20261109-9055', 'TRX-FKU-20261109-9055', 'qris', 398000.00, 'settlement', '{\"provider\":\"qris\",\"status_code\":\"200\",\"paid_at\":\"2026-11-09 16:56:02\"}', '2026-11-09 09:51:02', '2026-11-12 16:38:02'),
(57, 'FKU-20261109-9056', 'TRX-FKU-20261109-9056', 'midtrans', 1256000.00, 'settlement', '{\"provider\":\"midtrans\",\"status_code\":\"200\",\"paid_at\":\"2026-11-09 11:25:02\"}', '2026-11-09 04:20:02', '2026-11-13 08:41:02'),
(58, 'FKU-20261109-9057', 'TRX-FKU-20261109-9057', 'bank_transfer', 578000.00, 'settlement', '{\"provider\":\"bank_transfer\",\"status_code\":\"200\",\"paid_at\":\"2026-11-09 05:54:02\"}', '2026-11-08 22:49:02', '2026-11-12 13:20:02'),
(59, 'FKU-20261109-9058', 'TRX-FKU-20261109-9058', 'ewallet', 538000.00, 'settlement', '{\"provider\":\"ewallet\",\"status_code\":\"200\",\"paid_at\":\"2026-11-09 00:23:02\"}', '2026-11-08 17:18:02', '2026-11-12 11:40:02'),
(60, 'FKU-20261108-9059', 'TRX-FKU-20261108-9059', 'qris', 1296000.00, 'settlement', '{\"provider\":\"qris\",\"status_code\":\"200\",\"paid_at\":\"2026-11-08 18:52:02\"}', '2026-11-08 11:47:02', '2026-11-12 10:01:02'),
(61, 'FKU-20261108-9060', 'TRX-FKU-20261108-9060', 'midtrans', 389300.00, 'settlement', '{\"provider\":\"midtrans\",\"status_code\":\"200\",\"paid_at\":\"2026-11-08 13:21:02\"}', '2026-11-08 06:16:02', '2026-11-13 05:23:02'),
(62, 'FKU-20261108-9061', 'TRX-FKU-20261108-9061', 'bank_transfer', 638000.00, 'settlement', '{\"provider\":\"bank_transfer\",\"status_code\":\"200\",\"paid_at\":\"2026-11-08 07:50:02\"}', '2026-11-08 00:45:02', '2026-11-12 06:42:02'),
(63, 'FKU-20261108-9062', 'TRX-FKU-20261108-9062', 'ewallet', 1146000.00, 'settlement', '{\"provider\":\"ewallet\",\"status_code\":\"200\",\"paid_at\":\"2026-11-08 02:19:02\"}', '2026-11-07 19:14:02', '2026-11-12 05:03:02'),
(64, 'FKU-20261107-9063', 'TRX-FKU-20261107-9063', 'qris', 718000.00, 'settlement', '{\"provider\":\"qris\",\"status_code\":\"200\",\"paid_at\":\"2026-11-07 20:48:02\"}', '2026-11-07 13:43:02', '2026-11-12 03:24:02'),
(65, 'FKU-20261107-9064', 'TRX-FKU-20261107-9064', 'midtrans', 708000.00, 'settlement', '{\"provider\":\"midtrans\",\"status_code\":\"200\",\"paid_at\":\"2026-11-07 15:17:02\"}', '2026-11-07 08:12:02', '2026-11-13 02:04:02'),
(66, 'FKU-20261107-9065', 'TRX-FKU-20261107-9065', 'bank_transfer', 1506000.00, 'settlement', '{\"provider\":\"bank_transfer\",\"status_code\":\"200\",\"paid_at\":\"2026-11-07 09:46:02\"}', '2026-11-07 02:41:02', '2026-11-12 00:05:02'),
(67, 'FKU-20261107-9066', 'TRX-FKU-20261107-9066', 'ewallet', 1223000.00, 'settlement', '{\"provider\":\"ewallet\",\"status_code\":\"200\",\"paid_at\":\"2026-11-07 04:15:02\"}', '2026-11-06 21:10:02', '2026-11-13 00:25:02'),
(68, 'FKU-20261106-9067', 'TRX-FKU-20261106-9067', 'qris', 838000.00, 'settlement', '{\"provider\":\"qris\",\"status_code\":\"200\",\"paid_at\":\"2026-11-06 22:44:02\"}', '2026-11-06 15:39:02', '2026-11-12 23:35:02'),
(69, 'FKU-20261106-9068', 'TRX-FKU-20261106-9068', 'midtrans', 1246000.00, 'settlement', '{\"provider\":\"midtrans\",\"status_code\":\"200\",\"paid_at\":\"2026-11-06 17:13:02\"}', '2026-11-06 10:08:02', '2026-11-12 22:46:02'),
(70, 'FKU-20261106-9069', 'TRX-FKU-20261106-9069', 'bank_transfer', 280000.00, 'settlement', '{\"provider\":\"bank_transfer\",\"status_code\":\"200\",\"paid_at\":\"2026-11-06 11:42:02\"}', '2026-11-06 04:37:02', '2026-11-12 21:56:02'),
(71, 'FKU-20261106-9070', 'TRX-FKU-20261106-9070', 'ewallet', 538000.00, 'settlement', '{\"provider\":\"ewallet\",\"status_code\":\"200\",\"paid_at\":\"2026-11-06 06:11:02\"}', '2026-11-05 23:06:02', '2026-11-12 21:06:02'),
(72, 'FKU-20261106-9071', 'TRX-FKU-20261106-9071', 'qris', 1126000.00, 'settlement', '{\"provider\":\"qris\",\"status_code\":\"200\",\"paid_at\":\"2026-11-06 00:40:02\"}', '2026-11-05 17:35:02', '2026-11-12 20:17:02'),
(73, 'FKU-20261105-9072', 'TRX-FKU-20261105-9072', 'midtrans', 520200.00, 'settlement', '{\"provider\":\"midtrans\",\"status_code\":\"200\",\"paid_at\":\"2026-11-05 19:09:02\"}', '2026-11-05 12:04:02', '2026-11-12 19:27:02'),
(74, 'FKU-20261105-9073', 'TRX-FKU-20261105-9073', 'bank_transfer', 508000.00, 'settlement', '{\"provider\":\"bank_transfer\",\"status_code\":\"200\",\"paid_at\":\"2026-11-05 13:38:02\"}', '2026-11-05 06:33:02', '2026-11-12 18:37:02'),
(75, 'FKU-20261105-9074', 'TRX-FKU-20261105-9074', 'ewallet', 1486000.00, 'settlement', '{\"provider\":\"ewallet\",\"status_code\":\"200\",\"paid_at\":\"2026-11-05 08:07:02\"}', '2026-11-05 01:02:02', '2026-11-12 17:48:02'),
(76, 'FKU-20261105-9075', 'TRX-FKU-20261105-9075', 'qris', 578000.00, 'settlement', '{\"provider\":\"qris\",\"status_code\":\"200\",\"paid_at\":\"2026-11-05 02:36:02\"}', '2026-11-04 19:31:02', '2026-11-12 16:58:02'),
(77, 'FKU-20261104-9076', 'TRX-FKU-20261104-9076', 'midtrans', 648000.00, 'settlement', '{\"provider\":\"midtrans\",\"status_code\":\"200\",\"paid_at\":\"2026-11-04 21:05:02\"}', '2026-11-04 14:00:02', '2026-11-12 16:08:02'),
(78, 'FKU-20261104-9077', 'TRX-FKU-20261104-9077', 'bank_transfer', 1026000.00, 'settlement', '{\"provider\":\"bank_transfer\",\"status_code\":\"200\",\"paid_at\":\"2026-11-04 15:34:02\"}', '2026-11-04 08:29:02', '2026-11-12 15:19:02'),
(79, 'FKU-20261104-9078', 'TRX-FKU-20261104-9078', 'ewallet', 898000.00, 'settlement', '{\"provider\":\"ewallet\",\"status_code\":\"200\",\"paid_at\":\"2026-11-04 10:03:02\"}', '2026-11-04 02:58:02', '2026-11-12 14:29:02'),
(80, 'FKU-20261104-9079', 'TRX-FKU-20261104-9079', 'qris', 398000.00, 'settlement', '{\"provider\":\"qris\",\"status_code\":\"200\",\"paid_at\":\"2026-11-04 04:32:02\"}', '2026-11-03 21:27:02', '2026-11-12 13:39:02'),
(81, 'FKU-20261103-9080', 'TRX-FKU-20261103-9080', 'midtrans', 1256000.00, 'settlement', '{\"provider\":\"midtrans\",\"status_code\":\"200\",\"paid_at\":\"2026-11-03 23:01:02\"}', '2026-11-03 15:56:02', '2026-11-12 12:50:02'),
(82, 'FKU-20261103-9081', 'TRX-FKU-20261103-9081', 'bank_transfer', 578000.00, 'expire', '{\"provider\":\"bank_transfer\",\"status_code\":\"201\",\"paid_at\":null}', '2026-11-03 10:25:02', '2026-11-06 15:13:02'),
(83, 'FKU-20261103-9082', 'TRX-FKU-20261103-9082', 'ewallet', 538000.00, 'settlement', '{\"provider\":\"ewallet\",\"status_code\":\"200\",\"paid_at\":\"2026-11-03 11:59:02\"}', '2026-11-03 04:54:02', '2026-11-12 11:11:02'),
(84, 'FKU-20261103-9083', 'TRX-FKU-20261103-9083', 'qris', 1296000.00, 'settlement', '{\"provider\":\"qris\",\"status_code\":\"200\",\"paid_at\":\"2026-11-03 06:28:02\"}', '2026-11-02 23:23:02', '2026-11-12 10:21:02'),
(85, 'FKU-20261030-9084', 'TRX-FKU-20261030-9084', 'midtrans', 433000.00, 'settlement', '{\"provider\":\"midtrans\",\"status_code\":\"200\",\"paid_at\":\"2026-10-30 09:29:02\"}', '2026-10-30 02:24:02', '2026-11-11 20:24:02'),
(86, 'FKU-20261029-9085', 'TRX-FKU-20261029-9085', 'bank_transfer', 638000.00, 'settlement', '{\"provider\":\"bank_transfer\",\"status_code\":\"200\",\"paid_at\":\"2026-10-29 07:18:02\"}', '2026-10-29 00:13:02', '2026-11-11 16:28:02'),
(87, 'FKU-20261028-9086', 'TRX-FKU-20261028-9086', 'ewallet', 1146000.00, 'settlement', '{\"provider\":\"ewallet\",\"status_code\":\"200\",\"paid_at\":\"2026-10-28 05:07:02\"}', '2026-10-27 22:02:02', '2026-11-11 12:33:02'),
(88, 'FKU-20261027-9087', 'TRX-FKU-20261027-9087', 'qris', 718000.00, 'settlement', '{\"provider\":\"qris\",\"status_code\":\"200\",\"paid_at\":\"2026-10-27 02:56:02\"}', '2026-10-26 19:51:02', '2026-11-11 08:37:02'),
(89, 'FKU-20261026-9088', 'TRX-FKU-20261026-9088', 'midtrans', 708000.00, 'settlement', '{\"provider\":\"midtrans\",\"status_code\":\"200\",\"paid_at\":\"2026-10-26 00:45:02\"}', '2026-10-25 17:40:02', '2026-11-11 04:41:02'),
(90, 'FKU-20261024-9089', 'TRX-FKU-20261024-9089', 'bank_transfer', 1576000.00, 'settlement', '{\"provider\":\"bank_transfer\",\"status_code\":\"200\",\"paid_at\":\"2026-10-24 22:34:02\"}', '2026-10-24 15:29:02', '2026-11-11 00:46:02'),
(91, 'FKU-20261023-9090', 'TRX-FKU-20261023-9090', 'ewallet', 1223000.00, 'settlement', '{\"provider\":\"ewallet\",\"status_code\":\"200\",\"paid_at\":\"2026-10-23 20:23:02\"}', '2026-10-23 13:18:02', '2026-11-10 20:50:02'),
(92, 'FKU-20261022-9091', 'TRX-FKU-20261022-9091', 'qris', 838000.00, 'settlement', '{\"provider\":\"qris\",\"status_code\":\"200\",\"paid_at\":\"2026-10-22 18:12:02\"}', '2026-10-22 11:07:02', '2026-11-10 16:54:02'),
(93, 'FKU-20261021-9092', 'TRX-FKU-20261021-9092', 'midtrans', 1446000.00, 'settlement', '{\"provider\":\"midtrans\",\"status_code\":\"200\",\"paid_at\":\"2026-10-21 16:01:02\"}', '2026-10-21 08:56:02', '2026-11-10 12:59:02'),
(94, 'FKU-20261020-9093', 'TRX-FKU-20261020-9093', 'bank_transfer', 274000.00, 'settlement', '{\"provider\":\"bank_transfer\",\"status_code\":\"200\",\"paid_at\":\"2026-10-20 13:50:02\"}', '2026-10-20 06:45:02', '2026-11-10 09:03:02'),
(95, 'FKU-20261019-9094', 'TRX-FKU-20261019-9094', 'ewallet', 708000.00, 'settlement', '{\"provider\":\"ewallet\",\"status_code\":\"200\",\"paid_at\":\"2026-10-19 11:39:02\"}', '2026-10-19 04:34:02', '2026-11-10 05:08:02'),
(96, 'FKU-20261018-9095', 'TRX-FKU-20261018-9095', 'qris', 1546000.00, 'settlement', '{\"provider\":\"qris\",\"status_code\":\"200\",\"paid_at\":\"2026-10-18 09:28:02\"}', '2026-10-18 02:23:02', '2026-11-10 01:12:02'),
(97, 'FKU-20261017-9096', 'TRX-FKU-20261017-9096', 'midtrans', 833000.00, 'settlement', '{\"provider\":\"midtrans\",\"status_code\":\"200\",\"paid_at\":\"2026-10-17 07:17:02\"}', '2026-10-17 00:12:02', '2026-11-09 21:16:02'),
(98, 'FKU-20261016-9097', 'TRX-FKU-20261016-9097', 'bank_transfer', 858000.00, 'settlement', '{\"provider\":\"bank_transfer\",\"status_code\":\"200\",\"paid_at\":\"2026-10-16 05:06:02\"}', '2026-10-15 22:01:02', '2026-11-09 17:21:02'),
(99, 'FKU-20261015-9098', 'TRX-FKU-20261015-9098', 'ewallet', 1236000.00, 'settlement', '{\"provider\":\"ewallet\",\"status_code\":\"200\",\"paid_at\":\"2026-10-15 02:55:02\"}', '2026-10-14 19:50:02', '2026-11-09 13:25:02'),
(100, 'FKU-20261014-9099', 'TRX-FKU-20261014-9099', 'qris', 638000.00, 'settlement', '{\"provider\":\"qris\",\"status_code\":\"200\",\"paid_at\":\"2026-10-14 00:44:02\"}', '2026-10-13 17:39:02', '2026-11-09 09:29:02'),
(101, 'FKU-20261012-9100', 'TRX-FKU-20261012-9100', 'midtrans', 498000.00, 'settlement', '{\"provider\":\"midtrans\",\"status_code\":\"200\",\"paid_at\":\"2026-10-12 22:33:02\"}', '2026-10-12 15:28:02', '2026-11-09 05:34:02'),
(102, 'FKU-20261011-9101', 'TRX-FKU-20261011-9101', 'bank_transfer', 896000.00, 'settlement', '{\"provider\":\"bank_transfer\",\"status_code\":\"200\",\"paid_at\":\"2026-10-11 20:22:02\"}', '2026-10-11 13:17:02', '2026-11-09 01:38:02'),
(103, 'FKU-20261010-9102', 'TRX-FKU-20261010-9102', 'ewallet', 558000.00, 'settlement', '{\"provider\":\"ewallet\",\"status_code\":\"200\",\"paid_at\":\"2026-10-10 18:11:02\"}', '2026-10-10 11:06:02', '2026-11-08 21:42:02'),
(104, 'FKU-20261009-9103', 'TRX-FKU-20261009-9103', 'qris', 528000.00, 'settlement', '{\"provider\":\"qris\",\"status_code\":\"200\",\"paid_at\":\"2026-10-09 16:00:02\"}', '2026-10-09 08:55:02', '2026-11-08 17:47:02'),
(105, 'FKU-20261008-9104', 'TRX-FKU-20261008-9104', 'midtrans', 1256000.00, 'settlement', '{\"provider\":\"midtrans\",\"status_code\":\"200\",\"paid_at\":\"2026-10-08 13:49:02\"}', '2026-10-08 06:44:02', '2026-11-08 13:51:02'),
(106, 'FKU-20261007-9105', 'TRX-FKU-20261007-9105', 'bank_transfer', 578000.00, 'settlement', '{\"provider\":\"bank_transfer\",\"status_code\":\"200\",\"paid_at\":\"2026-10-07 11:38:02\"}', '2026-10-07 04:33:02', '2026-11-08 09:55:02'),
(107, 'FKU-20261006-9106', 'TRX-FKU-20261006-9106', 'ewallet', 538000.00, 'settlement', '{\"provider\":\"ewallet\",\"status_code\":\"200\",\"paid_at\":\"2026-10-06 09:27:02\"}', '2026-10-06 02:22:02', '2026-11-08 06:00:02'),
(108, 'FKU-20261005-9107', 'TRX-FKU-20261005-9107', 'qris', 1296000.00, 'settlement', '{\"provider\":\"qris\",\"status_code\":\"200\",\"paid_at\":\"2026-10-05 07:16:02\"}', '2026-10-05 00:11:02', '2026-11-08 02:04:02'),
(109, 'FKU-20261004-9108', 'TRX-FKU-20261004-9108', 'midtrans', 458000.00, 'expire', '{\"provider\":\"midtrans\",\"status_code\":\"201\",\"paid_at\":null}', '2026-10-03 22:00:02', '2026-10-16 06:31:02'),
(110, 'FKU-20261003-9109', 'TRX-FKU-20261003-9109', 'bank_transfer', 638000.00, 'settlement', '{\"provider\":\"bank_transfer\",\"status_code\":\"200\",\"paid_at\":\"2026-10-03 02:54:02\"}', '2026-10-02 19:49:02', '2026-11-07 18:13:02'),
(111, 'FKU-20261002-9110', 'TRX-FKU-20261002-9110', 'ewallet', 1146000.00, 'settlement', '{\"provider\":\"ewallet\",\"status_code\":\"200\",\"paid_at\":\"2026-10-02 00:43:02\"}', '2026-10-01 17:38:02', '2026-11-07 14:17:02'),
(112, 'FKU-20260930-9111', 'TRX-FKU-20260930-9111', 'qris', 718000.00, 'settlement', '{\"provider\":\"qris\",\"status_code\":\"200\",\"paid_at\":\"2026-09-30 22:32:02\"}', '2026-09-30 15:27:02', '2026-11-07 10:21:02'),
(113, 'FKU-20260929-9112', 'TRX-FKU-20260929-9112', 'midtrans', 708000.00, 'settlement', '{\"provider\":\"midtrans\",\"status_code\":\"200\",\"paid_at\":\"2026-09-29 20:21:02\"}', '2026-09-29 13:16:02', '2026-11-07 06:26:02'),
(114, 'FKU-20260928-9113', 'TRX-FKU-20260928-9113', 'bank_transfer', 1526000.00, 'settlement', '{\"provider\":\"bank_transfer\",\"status_code\":\"200\",\"paid_at\":\"2026-09-28 18:10:02\"}', '2026-09-28 11:05:02', '2026-11-07 02:30:02'),
(115, 'FKU-20260927-9114', 'TRX-FKU-20260927-9114', 'ewallet', 1223000.00, 'settlement', '{\"provider\":\"ewallet\",\"status_code\":\"200\",\"paid_at\":\"2026-09-27 15:59:02\"}', '2026-09-27 08:54:02', '2026-11-06 22:35:02'),
(116, 'FKU-20260926-9115', 'TRX-FKU-20260926-9115', 'qris', 838000.00, 'settlement', '{\"provider\":\"qris\",\"status_code\":\"200\",\"paid_at\":\"2026-09-26 13:48:02\"}', '2026-09-26 06:43:02', '2026-11-06 18:39:02'),
(117, 'FKU-20260925-9116', 'TRX-FKU-20260925-9116', 'midtrans', 1276000.00, 'settlement', '{\"provider\":\"midtrans\",\"status_code\":\"200\",\"paid_at\":\"2026-09-25 11:37:02\"}', '2026-09-25 04:32:02', '2026-11-06 14:43:02'),
(118, 'FKU-20260924-9117', 'TRX-FKU-20260924-9117', 'bank_transfer', 268000.00, 'settlement', '{\"provider\":\"bank_transfer\",\"status_code\":\"200\",\"paid_at\":\"2026-09-24 09:26:02\"}', '2026-09-24 02:21:02', '2026-11-06 10:48:02'),
(119, 'FKU-20260923-9118', 'TRX-FKU-20260923-9118', 'ewallet', 598000.00, 'settlement', '{\"provider\":\"ewallet\",\"status_code\":\"200\",\"paid_at\":\"2026-09-23 07:15:02\"}', '2026-09-23 00:10:02', '2026-11-06 06:52:02'),
(120, 'FKU-20260922-9119', 'TRX-FKU-20260922-9119', 'qris', 1166000.00, 'settlement', '{\"provider\":\"qris\",\"status_code\":\"200\",\"paid_at\":\"2026-09-22 05:04:02\"}', '2026-09-21 21:59:02', '2026-11-06 02:56:02'),
(121, 'FKU-20260921-9120', 'TRX-FKU-20260921-9120', 'midtrans', 693000.00, 'settlement', '{\"provider\":\"midtrans\",\"status_code\":\"200\",\"paid_at\":\"2026-09-21 02:53:02\"}', '2026-09-20 19:48:02', '2026-11-05 23:01:02'),
(122, 'FKU-20260920-9121', 'TRX-FKU-20260920-9121', 'bank_transfer', 718000.00, 'settlement', '{\"provider\":\"bank_transfer\",\"status_code\":\"200\",\"paid_at\":\"2026-09-20 00:42:02\"}', '2026-09-19 17:37:02', '2026-11-05 19:05:02'),
(123, 'FKU-20260918-9122', 'TRX-FKU-20260918-9122', 'ewallet', 796000.00, 'settlement', '{\"provider\":\"ewallet\",\"status_code\":\"200\",\"paid_at\":\"2026-09-18 22:31:02\"}', '2026-09-18 15:26:02', '2026-11-05 15:09:02'),
(124, 'FKU-20260917-9123', 'TRX-FKU-20260917-9123', 'qris', 398000.00, 'settlement', '{\"provider\":\"qris\",\"status_code\":\"200\",\"paid_at\":\"2026-09-17 20:20:02\"}', '2026-09-17 13:15:02', '2026-11-05 11:14:02'),
(125, 'FKU-20260916-9124', 'TRX-FKU-20260916-9124', 'midtrans', 398000.00, 'settlement', '{\"provider\":\"midtrans\",\"status_code\":\"200\",\"paid_at\":\"2026-09-16 18:09:02\"}', '2026-09-16 11:04:02', '2026-11-05 07:18:02'),
(126, 'FKU-20260915-9125', 'TRX-FKU-20260915-9125', 'bank_transfer', 736000.00, 'settlement', '{\"provider\":\"bank_transfer\",\"status_code\":\"200\",\"paid_at\":\"2026-09-15 15:58:02\"}', '2026-09-15 08:53:02', '2026-11-05 03:22:02'),
(127, 'FKU-20260914-9126', 'TRX-FKU-20260914-9126', 'ewallet', 538000.00, 'settlement', '{\"provider\":\"ewallet\",\"status_code\":\"200\",\"paid_at\":\"2026-09-14 13:47:02\"}', '2026-09-14 06:42:02', '2026-11-04 23:27:02'),
(128, 'FKU-20260913-9127', 'TRX-FKU-20260913-9127', 'qris', 518000.00, 'settlement', '{\"provider\":\"qris\",\"status_code\":\"200\",\"paid_at\":\"2026-09-13 11:36:02\"}', '2026-09-13 04:31:02', '2026-11-04 19:31:02'),
(129, 'FKU-20260912-9128', 'TRX-FKU-20260912-9128', 'midtrans', 1056000.00, 'settlement', '{\"provider\":\"midtrans\",\"status_code\":\"200\",\"paid_at\":\"2026-09-12 09:25:02\"}', '2026-09-12 02:20:02', '2026-11-04 15:35:02'),
(130, 'FKU-20260911-9129', 'TRX-FKU-20260911-9129', 'bank_transfer', 418000.00, 'settlement', '{\"provider\":\"bank_transfer\",\"status_code\":\"200\",\"paid_at\":\"2026-09-11 07:14:02\"}', '2026-09-11 00:09:02', '2026-11-04 11:40:02'),
(131, 'FKU-20260910-9130', 'TRX-FKU-20260910-9130', 'ewallet', 398000.00, 'settlement', '{\"provider\":\"ewallet\",\"status_code\":\"200\",\"paid_at\":\"2026-09-10 05:03:02\"}', '2026-09-09 21:58:02', '2026-11-04 07:44:02'),
(132, 'FKU-20260909-9131', 'TRX-FKU-20260909-9131', 'qris', 1196000.00, 'settlement', '{\"provider\":\"qris\",\"status_code\":\"200\",\"paid_at\":\"2026-09-09 02:52:02\"}', '2026-09-08 19:47:02', '2026-11-04 03:48:02');

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `description`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'products.manage', 'Mengelola produk dan varian', 1, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(2, 'banners.manage', 'Mengelola banner toko', 1, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(3, 'promotions.manage', 'Mengelola promosi toko', 1, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(4, 'vouchers.manage', 'Mengelola voucher toko', 1, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(5, 'orders.view', 'Melihat pesanan', 1, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(6, 'orders.manage', 'Mengelola pesanan', 1, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(7, 'checkout.create', 'Membuat checkout', 1, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(8, 'reports.export', 'Mengekspor laporan', 1, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(9, 'finance.manage', 'Mengelola keuangan toko', 1, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(10, 'stock.manage', 'Mengelola stok dan riwayat pergerakan barang', 1, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(11, 'tickets.create', 'Membuat dan membalas Help', 1, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(12, 'tickets.manage', 'Mengelola seluruh Help', 1, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(13, 'reviews.create', 'Membuat dan mengelola review milik sendiri', 1, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(14, 'reviews.manage', 'Memoderasi seluruh review produk', 1, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(15, 'chat.use', 'Menggunakan percakapan', 1, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(16, 'announcements.manage', 'Mengirim announcement', 1, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(17, 'users.manage', 'Mengelola pengguna', 1, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(18, 'roles.manage', 'Mengelola peran dan hak akses', 1, '2026-11-14 02:23:41', '2026-11-14 02:23:41');

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint UNSIGNED NOT NULL,
  `primary_category_id` bigint UNSIGNED DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `brand` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `thumbnail` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('draft','published','archived') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'published',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `allows_preorder` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_by` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `primary_category_id`, `name`, `slug`, `description`, `brand`, `thumbnail`, `status`, `is_active`, `allows_preorder`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 3, 'Kaos Polos Cotton Combed 24s Hitam', 'fashionku-kaos-polos-cotton-combed-24s-hitam', 'Kaos polos dengan bahan cotton combed 24s yang halus dan menyerap keringat. Jahitan rantai di bagian bahu menjaga bentuk tetap rapi setelah berkali-kali dicuci.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Basic Wear', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 00:23:55', '2026-11-14 00:23:55', NULL),
(2, 3, 'Kaos Oversize Drop Shoulder Cream', 'fashionku-kaos-oversize-drop-shoulder-cream', 'Potongan oversize dengan jatuh bahu yang santai, dijahit dari cotton fleece 20s yang tebal namun tetap breathable. Cocok untuk layering harian.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Prego Studio', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-13 19:23:55', '2026-11-13 19:23:55', NULL),
(3, 3, 'Kaos Lengan Panjang Heavyweight Doff Abu', 'fashionku-kaos-lengan-panjang-heavyweight-doff-abu', 'Lengan panjang dengan bahan doff yang tidak menerawang dan terasa tebal di badan. Manset rib menjaga pergelangan tetap kencang.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Northline', 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-13 14:23:55', '2026-11-13 14:23:55', NULL),
(4, 3, 'Kaos Raglan Cotton Blend Navy', 'fashionku-kaos-raglan-cotton-blend-navy', 'Kain raglan dengan garis kontras di lengan, bahan cotton blend yang elastis sehingga nyaman dipakai bergerak. Regular fit.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Basic Wear', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-13 09:23:55', '2026-11-13 09:23:55', NULL),
(5, 3, 'Kaos Premium Combed 30s Putih', 'fashionku-kaos-premium-combed-30s-putih', 'Kaos putih solid dengan permukaan halus dan tidak mudah kusut. Leher crew neck dengan rib 2x2 yang kuat.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Loom & Thread', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-13 04:23:55', '2026-11-13 04:23:55', NULL),
(6, 3, 'Kaos Oversize Graphic Slow Living Sand', 'fashionku-kaos-oversize-graphic-slow-living-sand', 'Desain sablon plastisol bertema slow living pada bahan sand yang lembut. Sablon tidak mudah pecah meski sering dicuci.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Prego Studio', 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-12 23:23:55', '2026-11-12 23:23:55', NULL),
(7, 3, 'Kaos Turtle Neck Rib Hitam', 'fashionku-kaos-turtle-neck-rib-hitam', 'Turtleneck rajut rib yang memeluk badan dan jatuh rapi. Bahan viscose memberi efek licin sejuk saat dipakai.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Rue Atelier', 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-12 18:23:55', '2026-11-12 18:23:55', NULL),
(8, 3, 'Kaos Crop Boxy Sage', 'fashionku-kaos-crop-boxy-sage', 'Potongan crop boxy dengan bahan slub bertekstur. Panjang badan berhenti tepat di pinggang untuk dipadukan dengan high waist.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Rue Atelier', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-12 13:23:55', '2026-11-12 13:23:55', NULL),
(9, 3, 'Kaos Polo Knit Sand', 'fashionku-kaos-polo-knit-sand', 'Polo rajut pique dengan dua kancing dan kerah kaku yang tetap berdiri. Breathable untuk cuaca tropis.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Kinship Club', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-12 09:44:00', '2026-11-12 09:44:00', NULL),
(10, 3, 'Kaos Undershirt Viscose Putih', 'fashionku-kaos-undershirt-viscose-putih', 'Inner tipis dengan bahan viscose yang tidak bikin gerah, nyaman dipakai di balik kemeja. Jahitan flatlock anti gatal.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Basic Wear', 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-10 10:57:00', '2026-11-10 10:57:00', NULL),
(11, 4, 'Kemeja Flannel Kotak Maroon', 'fashionku-kemeja-flannel-kotak-maroon', 'Flannel brushed yang lembut dengan motif kotak klasik. Dua kantong dada dan kancing imitasi kayu.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Northline', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-08 01:10:00', '2026-11-08 01:10:00', NULL),
(12, 4, 'Kemeja Oxford Slim Fit Putih', 'fashionku-kemeja-oxford-slim-fit-putih', 'Kemeja oxford dengan potongan slim fit yang tetap nyaman di badan. Kerah button-down dan manset satu kancing.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Loom & Thread', 'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-06 02:23:00', '2026-11-06 02:23:00', NULL),
(13, 4, 'Kemeja Linen Oversize Khaki', 'fashionku-kemeja-linen-oversize-khaki', 'Linen blend yang jatuh ringan dan sedikit transparan khas linen. Dipotong oversize dengan garis jahit kontras.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Prego Studio', 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-04 03:36:00', '2026-11-04 03:36:00', NULL),
(14, 4, 'Kemeja Denim Washed Biru', 'fashionku-kemeja-denim-washed-biru', 'Denim 8 oz dengan washing ringan, tidak kaku sejak pemakaian pertama. Cocok dipakai sebagai outer tipis.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Urban Ridge', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-02 04:49:00', '2026-11-02 04:49:00', NULL),
(15, 4, 'Kemeja Batik Lengan Panjang Parang', 'fashionku-kemeja-batik-lengan-panjang-parang', 'Batik cap motif parang pada katun primisima yang halus. Kerah tegak dan potongan lurus klasik.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Sekar Batik', 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-31 05:02:00', '2026-10-31 05:02:00', NULL),
(16, 4, 'Kemeja Corduroy Cokelat Tua', 'fashionku-kemeja-corduroy-cokelat-tua', 'Corduroy 8 wale dengan garis rapat yang hangat dipakai saat malam. Regular fit dengan kantong dada kiri.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Kinship Club', 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-29 06:15:00', '2026-10-29 06:15:00', NULL),
(17, 4, 'Kemeja Twill Asimetri Navy', 'fashionku-kemeja-twill-asimetri-navy', 'Twill tebal dengan potongan asimetri di bagian bawah, menutupi pinggul. Kancing imitasi tanduk.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Rue Atelier', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-27 07:28:00', '2026-10-27 07:28:00', NULL),
(18, 4, 'Kemeja Camp Shirt Bunga Hutan', 'fashionku-kemeja-camp-shirt-bunga-hutan', 'Camp collar dengan print bunga hutan warna hijau tua. Bahan rayon yang jatuh dan tidak menerawang.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Kinship Club', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-25 08:41:00', '2026-10-25 08:41:00', NULL),
(19, 5, 'Jaket Denim Oversize Blue Washed', 'fashionku-jaket-denim-oversize-blue-washed', 'Denim 12 oz dengan potongan oversize, dua kantong dada dan yoke belakang. Semakin sering dipakai semakin nyaman.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Urban Ridge', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-23 09:54:00', '2026-10-23 09:54:00', NULL),
(20, 5, 'Jaket Varsity Wool Blend Navy Cream', 'fashionku-jaket-varsity-wool-blend-navy-cream', 'Body wol blend dengan lengan kulit sintetis, rib di manset dan pinggang. Patch bordir di dada kiri.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Kinship Club', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-21 10:07:00', '2026-10-21 10:07:00', NULL),
(21, 5, 'Jaket Bomber Ripstop Hitam', 'fashionku-jaket-bomber-ripstop-hitam', 'Ripstop nylon yang ringan dan tahan angin, dengan lining mesh. Zip YKK dan dua kantong sisi.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Northline', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-19 01:20:00', '2026-10-19 01:20:00', NULL),
(22, 5, 'Jaket Hiking Softshell Abu', 'fashionku-jaket-hiking-softshell-abu', 'Softshell tiga lapis tahan angin dan sinar UV, dengan hood yang bisa dilepas. Cocok untuk perjalanan luar ruang.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Alpine Supply', 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-17 02:33:00', '2026-10-17 02:33:00', NULL),
(23, 5, 'Jaket Kanvas Kerja Cokelat', 'fashionku-jaket-kanvas-kerja-cokelat', 'Kanvas 14 oz yang tebal dan tahan lama, dengan empat kantong fungsional. Original fit, tidak terlalu longgar.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Urban Ridge', 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-15 03:46:00', '2026-10-15 03:46:00', NULL),
(24, 5, 'Jaket Harrington Cotton Navy', 'fashionku-jaket-harrington-cotton-navy', 'Harrington klasik dengan lining kotak-kotak, manset rib dan tali pinggang. Ringan untuk cuaca malam.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Prego Studio', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-13 04:59:00', '2026-10-13 04:59:00', NULL),
(25, 6, 'Celana Chino Slim Fit Khaki', 'fashionku-celana-chino-slim-fit-khaki', 'Chino dengan sedikit stretch sehingga nyaman duduk lama. Pinggang regular dan ujung kaki sedikit menyempit.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Northline', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-11 05:12:00', '2026-10-11 05:12:00', NULL),
(26, 6, 'Celana Jeans Straight Leg Indigo', 'fashionku-celana-jeans-straight-leg-indigo', 'Straight leg dengan raw hem, bahan denim 12 oz yang tidak melar di lutut. Lima kantong klasik.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Urban Ridge', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-09 06:25:00', '2026-10-09 06:25:00', NULL),
(27, 6, 'Celana Cargo Ripstop Olive', 'fashionku-celana-cargo-ripstop-olive', 'Kantong cargo enam sisi dengan penutup kancing, bahan ripstop yang kuat. Tali pengatur di bagian bawah kaki.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Alpine Supply', 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-07 07:38:00', '2026-10-07 07:38:00', NULL),
(28, 6, 'Celana Formal Wool Blend Hitam', 'fashionku-celana-formal-wool-blend-hitam', 'Wool blend halus dengan lipatan depan permanen, jatuh lurus tanpa perlu disetrika setiap hari.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Loom & Thread', 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-05 08:51:00', '2026-10-05 08:51:00', NULL),
(29, 6, 'Celana Training Sweatpant Grey', 'fashionku-celana-training-sweatpant-grey', 'French terry yang lembut di dalam, dengan tali serut dan manset rib. Nyaman untuk latihan maupun santai.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Prego Studio', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&h=900&q=80', 'draft', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-03 09:04:00', '2026-10-03 09:04:00', NULL),
(30, 6, 'Celana Panjang Kanvas Cokelat', 'fashionku-celana-panjang-kanvas-cokelat', 'Kanvas 10 oz dengan siluet lurus dan tiga kantong. Warna akan memudar alami seiring lama pemakaian.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Urban Ridge', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-01 10:17:00', '2026-10-01 10:17:00', NULL),
(31, 6, 'Celana Jeans Slim Stretch Black', 'fashionku-celana-jeans-slim-stretch-black', 'Black denim dengan sedikit stretch, warna hitam pekat yang tidak mudah pudar. Slim fit dengan ujung kaki 15 cm.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Urban Ridge', 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-09-29 01:30:00', '2026-09-29 01:30:00', NULL),
(32, 8, 'Dress Midi Linen Krem', 'fashionku-dress-midi-linen-krem', 'Midi dress dengan bahan linen yang sejuk dan tali pinggang bisa dilepas. Panjang 110 cm dari bahu.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Luna Atelier', 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-09-27 02:43:00', '2026-09-27 02:43:00', NULL),
(33, 8, 'Dress Slip Satin Champagne', 'fashionku-dress-slip-satin-champagne', 'Slip dress potongan bias dengan tali adjustable dan bahan satin yang jatuh licin. Perlu dipakai dengan inner.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Rue Atelier', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-09-25 03:56:00', '2026-09-25 03:56:00', NULL),
(34, 8, 'Dress Wrap Floral Sage', 'fashionku-dress-wrap-floral-sage', 'Wrap dress dengan tali pinggang yang diikat di sisi, print floral warna sage yang lembut. Lengan tiga per empat.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Sekar Studio', 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-09-23 04:09:00', '2026-09-23 04:09:00', NULL),
(35, 8, 'Dress Shirt Midi Denim Light', 'fashionku-dress-shirt-midi-denim-light', 'Denim light wash dengan kancing depan penuh dan ikat pinggang. Bisa dipakai sebagai outer panjang.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Kinship Club', 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-09-21 05:22:00', '2026-09-21 05:22:00', NULL),
(36, 8, 'Dress Maxi Katun Batik Parang', 'fashionku-dress-maxi-katun-batik-parang', 'Batik parang pada katun primisima dengan potongan maxi dan lengan pendek. Karet di bagian belakang pinggang.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Sekar Batik', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-09-19 06:35:00', '2026-09-19 06:35:00', NULL),
(37, 8, 'Dress Bodycon Rib Hitam', 'fashionku-dress-bodycon-rib-hitam', 'Rajut rib elastis yang mengikuti bentuk badan, panjang di atas lutut. Bahan tebal sehingga tidak menerawang.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Rue Atelier', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&h=900&q=80', 'archived', 0, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-09-17 07:48:00', '2026-09-17 07:48:00', NULL),
(38, 8, 'Dress Sundress Tiered Gingham', 'fashionku-dress-sundress-tiered-gingham', 'Tiga tingkat kain gingham dengan tali bahu adjustable dan karet di punggung. Ringan untuk cuaca panas.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Luna Atelier', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-09-15 08:01:00', '2026-09-15 08:01:00', NULL),
(39, 8, 'Dress Kemeja Midi Khaki', 'fashionku-dress-kemeja-midi-khaki', 'Shirt dress dengan kancing depan, kantong dada dan ikat pinggang. Panjang midi dengan belahan samping.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Northline', 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-09-13 09:14:00', '2026-09-13 09:14:00', NULL),
(40, 8, 'Dress Off Shoulder Ruffle Terracotta', 'fashionku-dress-off-shoulder-ruffle-terracotta', 'Off shoulder dengan lengan ruffle dan bahan crepe yang tidak mudah kusut. Ada karet di bagian dada.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Luna Atelier', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-09-11 10:27:00', '2026-09-11 10:27:00', NULL),
(41, 9, 'Blus Ruffle Satin Ivory', 'fashionku-blus-ruffle-satin-ivory', 'Ruffle di lengan dan bahu, bahan satin ivory yang elegan untuk acara formal. Kancing belakang tersembunyi.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Luna Atelier', 'https://images.unsplash.com/photo-1496217590455-aa63a8350eea?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-09-09 01:40:00', '2026-09-09 01:40:00', NULL),
(42, 9, 'Blus Kerah Peter Pan Putih', 'fashionku-blus-kerah-peter-pan-putih', 'Kerah peter pan dengan aksen pita, bahan poplin yang tidak menerawang. Lengan panjang manset kancing.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Rue Atelier', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-09-07 02:53:00', '2026-09-07 02:53:00', NULL),
(43, 9, 'Blus Oversized Poplin Navy', 'fashionku-blus-oversized-poplin-navy', 'Potongan oversized dengan jatuh bahu, nyaman dipakai ke kantor maupun santai. Bisa dikancingkan penuh.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Northline', 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-09-05 03:06:00', '2026-09-05 03:06:00', NULL),
(44, 9, 'Blus Crop Boxy Cotton Pink', 'fashionku-blus-crop-boxy-cotton-pink', 'Boxy crop dengan bahan slub bertekstur dan bahu jatuh. Panjang sampai pinggang, cocok untuk high waist.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Prego Studio', 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-09-03 04:19:00', '2026-09-03 04:19:00', NULL),
(45, 9, 'Blus Tie Front Viscose Dusty Blue', 'fashionku-blus-tie-front-viscose-dusty-blue', 'Tie front yang bisa diikat di depan atau dibiarkan longgar. Viscose halus dengan lengan balon pendek.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Rue Atelier', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-09-01 05:32:00', '2026-09-01 05:32:00', NULL),
(46, 9, 'Blus Batik Cap Sleeve Cokelat', 'fashionku-blus-batik-cap-sleeve-cokelat', 'Batik cap warna cokelat dengan lengan pendek dan kerah shanghai. Potongan lurus yang nyaman dipakai bekerja.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Sekar Batik', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-08-30 06:45:00', '2026-08-30 06:45:00', NULL),
(47, 9, 'Blus Knit Cropped Cream', 'fashionku-blus-knit-cropped-cream', 'Rajut rib cropped dengan lebar badan yang pas, cocok untuk layering bersama rok high waist.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Kinship Club', 'https://images.unsplash.com/photo-1496217590455-aa63a8350eea?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-08-28 07:58:00', '2026-08-28 07:58:00', NULL),
(48, 9, 'Blus Peplum Formal Hitam', 'fashionku-blus-peplum-formal-hitam', 'Peplum di pinggang dengan bahan crepe yang jatuh rapi. Lengan tiga per empat untuk tampilan formal.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Loom & Thread', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-08-26 08:11:00', '2026-08-26 08:11:00', NULL),
(49, 10, 'Rok Plisket Midi Hitam', 'fashionku-rok-plisket-midi-hitam', 'Plisket permanen yang tidak mudah kusut, mid-rise dengan karet di pinggang belakang. Panjang 80 cm.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Luna Atelier', 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-08-24 09:24:00', '2026-08-24 09:24:00', NULL),
(50, 10, 'Rok Denim A-Line Mid Blue', 'fashionku-rok-denim-a-line-mid-blue', 'A-line dengan kancing depan dan dua kantong samping. Denim 8 oz yang cukup tebal sehingga tidak transparan.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Urban Ridge', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-08-22 10:37:00', '2026-08-22 10:37:00', NULL),
(51, 10, 'Rok Span Mini Kulot Hitam', 'fashionku-rok-span-mini-kulot-hitam', 'Potongan kulot pendek dengan bahan span twill yang elastis. Pinggang karet dan ada kantong samping.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Rue Atelier', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-08-20 01:50:00', '2026-08-20 01:50:00', NULL),
(52, 10, 'Rok Linen Panjang Sage', 'fashionku-rok-linen-panjang-sage', 'Linen blend panjang dengan belahan depan dan tali pinggang dari kain yang sama. Jatuh ringan dan sejuk.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Luna Atelier', 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-08-18 02:03:00', '2026-08-18 02:03:00', NULL),
(53, 10, 'Rok Batik Lilit Motif Kawung', 'fashionku-rok-batik-lilit-motif-kawung', 'Rok lilit dengan motif kawung dan ikat pinggang, panjang midi. Bisa disarungkan dengan atasan polos.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Sekar Batik', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-08-16 03:16:00', '2026-08-16 03:16:00', NULL),
(54, 11, 'Blazer Oversized Linen Oat', 'fashionku-blazer-oversized-linen-oat', 'Blazer longgar dengan satu kancing dan bantalan bahu tipis. Bisa dipakai sebagai outer kerja maupun kasual.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Luna Atelier', 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-08-14 04:29:00', '2026-08-14 04:29:00', NULL),
(55, 11, 'Cardigan Rajut Cropped Mocca', 'fashionku-cardigan-rajut-cropped-mocca', 'Cardigan cropped dengan kancing mutiara imitasi, bahan rajut yang hangat namun tidak berat.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Kinship Club', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-08-12 05:42:00', '2026-08-12 05:42:00', NULL),
(56, 11, 'Trench Coat Katun Khaki', 'fashionku-trench-coat-katun-khaki', 'Gabardine tahan angin dengan tali pinggang dan epaulette di bahu. Panjang di bawah lutut.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Northline', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-08-10 06:55:00', '2026-08-10 06:55:00', NULL),
(57, 11, 'Bomber Satin Wanita Sage', 'fashionku-bomber-satin-wanita-sage', 'Bomber satin dengan rib di manset dan pinggang, ringan dan jatuh licin. Cocok untuk acara malam.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Rue Atelier', 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-08-08 07:08:00', '2026-08-08 07:08:00', NULL),
(58, 11, 'Kimono Rayon Floral', 'fashionku-kimono-rayon-floral', 'Kimono panjang dengan print floral, lengan lebar dan ikat pinggang. Bisa dipakai sebagai outer dress.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Sekar Studio', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&h=900&q=80', 'draft', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-08-06 08:21:00', '2026-08-06 08:21:00', NULL),
(59, 14, 'Sneakers Canvas Low Putih', 'fashionku-sneakers-canvas-low-putih', 'Kanvas 12 oz dengan sol karet vulkanisir dan insole empuk. Tahan lama untuk pemakaian harian.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Stride Co.', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-08-04 09:34:00', '2026-08-04 09:34:00', NULL),
(60, 14, 'Sneakers Chunky Retro Silver', 'fashionku-sneakers-chunky-retro-silver', 'Siluet chunky dengan panel mesh dan aksen silver metalik. Sol empat sentimeter yang empuk.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Stride Co.', 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-08-02 10:47:00', '2026-08-02 10:47:00', NULL),
(61, 14, 'Sepatu Kulit Formal Oxford Hitam', 'fashionku-sepatu-kulit-formal-oxford-hitam', 'Kulit sapi full grain dengan jahitan Blake dan sol karet anti selip. Cocok untuk acara formal.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Northline Leather', 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-07-31 01:00:00', '2026-07-31 01:00:00', NULL),
(62, 14, 'Loafers Kulit Sintetis Cokelat', 'fashionku-loafers-kulit-sintetis-cokelat', 'Loafers slip-on dengan aksen bit di bagian depan. Sol empuk dan ringan untuk dipakai sehari-hari.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Northline Leather', 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-07-29 02:13:00', '2026-07-29 02:13:00', NULL),
(63, 14, 'Pantofel Kulit Asli Navy', 'fashionku-pantofel-kulit-asli-navy', 'Pantofel dengan kulit sapi bertekstur halus dan sol kulit bertali karet. Bentuk klasik yang mudah dipadukan.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Northline Leather', 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-07-27 03:26:00', '2026-07-27 03:26:00', NULL),
(64, 14, 'Boots Chelsea Kulit Cokelat', 'fashionku-boots-chelsea-kulit-cokelat', 'Suede dengan panel elastis di sisi, sol karet tebal dan tahan air ringan. Tinggi mata kaki.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Alpine Supply', 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-07-25 04:39:00', '2026-07-25 04:39:00', NULL),
(65, 14, 'Boots Hiking Waterproof Brown', 'fashionku-boots-hiking-waterproof-brown', 'Nabuk waterproof dengan membran kedap air dan sol bergerigi untuk cengkeraman di tanah basah.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Alpine Supply', 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-07-23 05:52:00', '2026-07-23 05:52:00', NULL),
(66, 14, 'Sneakers Running Knit Abu', 'fashionku-sneakers-running-knit-abu', 'Upper knit seamless dengan midsole busa responsif. Ringan untuk lari pagi maupun latihan di gym.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Stride Co.', 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-07-21 06:05:00', '2026-07-21 06:05:00', NULL),
(67, 14, 'Wedges Kanvas Krem', 'fashionku-wedges-kanvas-krem', 'Wedges tujuh sentimeter dengan tali mata kaki yang bisa dilepas. Ringan dan stabil untuk dipakai lama.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Luna Atelier', 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-07-19 07:18:00', '2026-07-19 07:18:00', NULL),
(68, 14, 'Heels Blok Tali Hitam', 'fashionku-heels-blok-tali-hitam', 'Heels blok delapan sentimeter dengan tali ankle dan ujung runcing. Sol dalam berbantalan empuk.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Rue Atelier', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-07-17 08:31:00', '2026-07-17 08:31:00', NULL),
(69, 14, 'Sneakers Slip-On Denim', 'fashionku-sneakers-slip-on-denim', 'Slip-on kanvas denim dengan elastic di sisi, tanpa tali. Sol karet putih yang mudah dibersihkan.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Urban Ridge', 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-07-15 09:44:00', '2026-07-15 09:44:00', NULL),
(70, 14, 'Pantofel Wanita Nude', 'fashionku-pantofel-wanita-nude', 'Pantofel ujung membulat dengan blok lima sentimeter, warna nude yang mudah dipadukan. Cocok untuk bekerja.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Rue Atelier', 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-07-13 10:57:00', '2026-07-13 10:57:00', NULL),
(71, 15, 'Sandal Slide Puffy Hitam', 'fashionku-sandal-slide-puffy-hitam', 'Slide EVA ringan dengan tali empuk, tahan air dan cepat kering. Sol berlekuk anti selip.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Stride Co.', 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-07-11 01:10:00', '2026-07-11 01:10:00', NULL),
(72, 15, 'Sandal Kulit Tali Silang Cokelat', 'fashionku-sandal-kulit-tali-silang-cokelat', 'Tali silang dari kulit sapi asli dengan sol karet empuk. Aksen gesper logam di sisi.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Northline Leather', 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-07-09 02:23:00', '2026-07-09 02:23:00', NULL),
(73, 15, 'Sandal Sport Outdoor Abu', 'fashionku-sandal-sport-outdoor-abu', 'Webbing polyester dengan tiga titik pengatur, sol karet bergerigi untuk medan berbatu.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Alpine Supply', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-07-07 03:36:00', '2026-07-07 03:36:00', NULL),
(74, 15, 'Sandal Heels Tali Mocca', 'fashionku-sandal-heels-tali-mocca', 'Heels tujuh sentimeter dengan tali tipis di pergelangan dan sol empuk. Warna mocca yang netral.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Rue Atelier', 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&h=900&q=80', 'archived', 0, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-07-05 04:49:00', '2026-07-05 04:49:00', NULL),
(75, 17, 'Tas Ransel Kanvas Vintage Khaki', 'fashionku-tas-ransel-kanvas-vintage-khaki', 'Kanvas 16 oz dengan alas kulit dan gesper kuningan. Kompartemen laptop 14 inci dan tiga kantong depan.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Wander Bag', 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-07-03 05:02:00', '2026-07-03 05:02:00', NULL),
(76, 17, 'Ransel Laptop Water Repellent Hitam', 'fashionku-ransel-laptop-water-repellent-hitam', 'Polyester 900D tahan air ringan dengan slot laptop 15 inci dan lubang USB. Punggung mesh yang breathable.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Wander Bag', 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-07-01 06:15:00', '2026-07-01 06:15:00', NULL),
(77, 17, 'Ransel Roll Top Army', 'fashionku-ransel-roll-top-army', 'Roll top Cordura dengan kapasitas 22 liter yang bisa diperbesar. Cocok untuk harian maupun perjalanan singkat.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Alpine Supply', 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-06-29 07:28:00', '2026-06-29 07:28:00', NULL),
(78, 17, 'Ransel Mini Nylon Cream', 'fashionku-ransel-mini-nylon-cream', 'Ransel mini dengan tali bahu bisa disembunyikan, bisa dipakai sebagai sling maupun backpack. Muat tablet 10 inci.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Kinship Club', 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-06-27 08:41:00', '2026-06-27 08:41:00', NULL),
(79, 17, 'Ransel Kulit Cokelat', 'fashionku-ransel-kulit-cokelat', 'Kulit sapi full grain dengan hardware kuningan dan lining kanvas. Terlihat semakin bagus seiring usia pemakaian.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Northline Leather', 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-06-25 09:54:00', '2026-06-25 09:54:00', NULL),
(80, 18, 'Tas Selempang Kanvas Natural', 'fashionku-tas-selempang-kanvas-natural', 'Kanvas natural dengan dua kantong depan dan tali adjustable. Muat dompet, ponsel, dan botol kecil.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Wander Bag', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-06-23 10:07:00', '2026-06-23 10:07:00', NULL),
(81, 18, 'Sling Cordura Hitam', 'fashionku-sling-cordura-hitam', 'Sling Cordura dengan buckle cepat dan tiga kompartemen. Bisa dipakai di depan atau belakang badan.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Alpine Supply', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-06-21 01:20:00', '2026-06-21 01:20:00', NULL),
(82, 18, 'Tas Selempang Kulit Cokelat', 'fashionku-tas-selempang-kulit-cokelat', 'Kulit sapi dengan jahitan tangan dan gesper logam. Bentuk ramping yang cocok untuk pria maupun wanita.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Northline Leather', 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-06-19 02:33:00', '2026-06-19 02:33:00', NULL),
(83, 18, 'Sling Ripstop Olive', 'fashionku-sling-ripstop-olive', 'Ripstop ringan dengan tali webbing tebal dan kantong tersembunyi di bagian punggung. Tahan air ringan.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Alpine Supply', 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-06-17 03:46:00', '2026-06-17 03:46:00', NULL),
(84, 18, 'Selempang Mini Quilted Cream', 'fashionku-selempang-mini-quilted-cream', 'Quilted ringan dengan tali rantai imitasi, muat ponsel dan kartu. Cocok untuk acara santai.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Kinship Club', 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-06-15 04:59:00', '2026-06-15 04:59:00', NULL),
(85, 18, 'Messenger Kanvas Navy', 'fashionku-messenger-kanvas-navy', 'Messenger bag dengan penutup magnet dan kompartemen laptop 13 inci. Tali bahu bisa dilepas.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Wander Bag', 'https://images.unsplash.com/photo-1475180098004-ca77a66827be?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-06-13 05:12:00', '2026-06-13 05:12:00', NULL),
(86, 19, 'Dompet Kulit Lipat Hitam', 'fashionku-dompet-kulit-lipat-hitam', 'Lipat dua dengan enam slot kartu dan dua ruang uang kertas. Kulit sapi yang mengeras seiring pemakaian.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Northline Leather', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-06-11 06:25:00', '2026-06-11 06:25:00', NULL),
(87, 19, 'Dompet Kulit Panjang Cokelat', 'fashionku-dompet-kulit-panjang-cokelat', 'Model panjang dengan delapan slot kartu, ruang koin, dan tempat struk. Jahitan saddle stitch di pinggir.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Northline Leather', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&h=900&q=80', 'draft', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-06-09 07:38:00', '2026-06-09 07:38:00', NULL),
(88, 19, 'Dompet Kartu Slim Navy', 'fashionku-dompet-kartu-slim-navy', 'Dompet kartu tipis dengan empat slot dan ikat karet di tengah. Muat di kantong depan celana.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Northline Leather', 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-06-07 08:51:00', '2026-06-07 08:51:00', NULL),
(89, 19, 'Dompet Kanvas Olive', 'fashionku-dompet-kanvas-olive', 'Kanvas dengan lining tahan air dan tiga slot kartu. Bentuk lipat tiga yang ringkas.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Wander Bag', 'https://images.unsplash.com/photo-1475180098004-ca77a66827be?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-06-05 09:04:00', '2026-06-05 09:04:00', NULL),
(90, 21, 'Jam Tangan Minimalis Dial Putih', 'fashionku-jam-tangan-minimalis-dial-putih', 'Dial 36 mm bersih tanpa angka, strap kulit asli 18 mm. Mesin quartz Jepang dengan tahan air 3 ATM.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Chrono Lite', 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-06-03 10:17:00', '2026-06-03 10:17:00', NULL),
(91, 21, 'Jam Tangan Kulit Cokelat 38mm', 'fashionku-jam-tangan-kulit-cokelat-38mm', 'Kode 38 mm dengan indeks batang dan tanggal di posisi tiga. Kaca mineral anti gores.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Chrono Lite', 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-06-01 01:30:00', '2026-06-01 01:30:00', NULL);
INSERT INTO `products` (`id`, `primary_category_id`, `name`, `slug`, `description`, `brand`, `thumbnail`, `status`, `is_active`, `allows_preorder`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(92, 21, 'Jam Tangan Digital Sport Hitam', 'fashionku-jam-tangan-digital-sport-hitam', 'Resin ringan dengan lampu LED, stopwatch, dan alarm. Tahan air 5 ATM untuk aktivitas air ringan.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Chrono Lite', 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-05-30 02:43:00', '2026-05-30 02:43:00', NULL),
(93, 21, 'Jam Tangan Mesh Steel Silver', 'fashionku-jam-tangan-mesh-steel-silver', 'Strap mesh milanese yang bisa disesuaikan tanpa alat. Dial silver dengan indeks kristal.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Chrono Lite', 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-05-28 03:56:00', '2026-05-28 03:56:00', NULL),
(94, 21, 'Jam Tangan Couple Set Rose Gold', 'fashionku-jam-tangan-couple-set-rose-gold', 'Satu set berisi dua ukuran (36 mm dan 40 mm) dengan lapisan rose gold. Cocok untuk hadiah pasangan.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Chrono Lite', 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-05-26 04:09:00', '2026-05-26 04:09:00', NULL),
(95, 22, 'Kacamata Wayfarer Hitam', 'fashionku-kacamata-wayfarer-hitam', 'Frame asetat dengan lensa UV400 dan engsel logam. Bentuk wayfarer yang cocok untuk hampir semua bentuk wajah.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Optic Nine', 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-05-24 05:22:00', '2026-05-24 05:22:00', NULL),
(96, 22, 'Kacamata Bulat Frame Emas', 'fashionku-kacamata-bulat-frame-emas', 'Frame logam tipis dengan lensa hijau G15. Ringan dan nyaman dipakai lama.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Optic Nine', 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-05-22 06:35:00', '2026-05-22 06:35:00', NULL),
(97, 22, 'Kacamata Cat Eye Tortoise', 'fashionku-kacamata-cat-eye-tortoise', 'Cat eye dengan motif tortoise dan lensa gradasi cokelat. Ujung frame meruncing lembut.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Optic Nine', 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-05-20 07:48:00', '2026-05-20 07:48:00', NULL),
(98, 23, 'Kalung Rantai Stainless Gold', 'fashionku-kalung-rantai-stainless-gold', 'Rantai Cuban link dengan lapisan emas PVD yang tidak mudah pudar. Panjang 50 cm dengan pengatur 5 cm.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Aurum', 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-05-18 08:01:00', '2026-05-18 08:01:00', NULL),
(99, 23, 'Gelang Beads Natural Stone', 'fashionku-gelang-beads-natural-stone', 'Batu alam 8 mm dengan tali elastis yang kuat. Setiap butir punya corak yang sedikit berbeda.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Aurum', 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-05-16 09:14:00', '2026-05-16 09:14:00', NULL),
(100, 23, 'Anting Hoop Stainless Silver', 'fashionku-anting-hoop-stainless-silver', 'Hoop 2 cm dengan kait aman, ringan dan hypoallergenic. Cocok untuk pemakaian harian.\n\nDikemas dengan bubble wrap dan kardus tebal. Pesanan diproses maksimal 2x24 jam kerja.', 'Aurum', 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&h=900&q=80', 'published', 1, 0, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-05-14 10:27:00', '2026-05-14 10:27:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `product_attributes`
--

CREATE TABLE `product_attributes` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'select',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_attributes`
--

INSERT INTO `product_attributes` (`id`, `name`, `slug`, `type`, `created_at`, `updated_at`) VALUES
(1, 'Ukuran', 'ukuran', 'select', '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(2, 'Warna', 'warna', 'select', '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(3, 'Material', 'material', 'select', '2026-11-14 02:23:55', '2026-11-14 02:23:55');

-- --------------------------------------------------------

--
-- Table structure for table `product_attribute_values`
--

CREATE TABLE `product_attribute_values` (
  `id` bigint UNSIGNED NOT NULL,
  `product_id` bigint UNSIGNED NOT NULL,
  `attribute_id` bigint UNSIGNED NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_attribute_values`
--

INSERT INTO `product_attribute_values` (`id`, `product_id`, `attribute_id`, `value`, `created_at`, `updated_at`) VALUES
(1, 1, 3, 'Cotton Combed 24s', NULL, NULL),
(2, 2, 3, 'Cotton Fleece 20s', NULL, NULL),
(3, 3, 3, 'Cotton Doff 30s', NULL, NULL),
(4, 4, 3, 'Cotton Blend', NULL, NULL),
(5, 5, 3, 'Cotton Combed 30s', NULL, NULL),
(6, 6, 3, 'Cotton Combed 24s', NULL, NULL),
(7, 7, 3, 'Rib Viscose', NULL, NULL),
(8, 8, 3, 'Cotton Slub', NULL, NULL),
(9, 9, 3, 'Knit Pique', NULL, NULL),
(10, 10, 3, 'Viscose', NULL, NULL),
(11, 11, 3, 'Flannel Brushed', NULL, NULL),
(12, 12, 3, 'Oxford Cotton', NULL, NULL),
(13, 13, 3, 'Linen Blend', NULL, NULL),
(14, 14, 3, 'Denim 8 oz', NULL, NULL),
(15, 15, 3, 'Katun Primisima', NULL, NULL),
(16, 16, 3, 'Corduroy 8 Wale', NULL, NULL),
(17, 17, 3, 'Cotton Twill', NULL, NULL),
(18, 18, 3, 'Rayon', NULL, NULL),
(19, 19, 3, 'Denim 12 oz', NULL, NULL),
(20, 20, 3, 'Wool Blend', NULL, NULL),
(21, 21, 3, 'Ripstop Nylon', NULL, NULL),
(22, 22, 3, 'Softshell', NULL, NULL),
(23, 23, 3, 'Cotton Canvas 14 oz', NULL, NULL),
(24, 24, 3, 'Cotton Twill', NULL, NULL),
(25, 25, 3, 'Cotton Twill Stretch', NULL, NULL),
(26, 26, 3, 'Denim 12 oz', NULL, NULL),
(27, 27, 3, 'Cotton Ripstop', NULL, NULL),
(28, 28, 3, 'Wool Blend', NULL, NULL),
(29, 29, 3, 'French Terry', NULL, NULL),
(30, 30, 3, 'Cotton Canvas 10 oz', NULL, NULL),
(31, 31, 3, 'Denim Stretch', NULL, NULL),
(32, 32, 3, 'Linen', NULL, NULL),
(33, 33, 3, 'Satin Silk', NULL, NULL),
(34, 34, 3, 'Viscose', NULL, NULL),
(35, 35, 3, 'Denim 6 oz', NULL, NULL),
(36, 36, 3, 'Katun Primisima', NULL, NULL),
(37, 37, 3, 'Rib Knit', NULL, NULL),
(38, 38, 3, 'Cotton Gingham', NULL, NULL),
(39, 39, 3, 'Cotton Twill', NULL, NULL),
(40, 40, 3, 'Crepe', NULL, NULL),
(41, 41, 3, 'Satin', NULL, NULL),
(42, 42, 3, 'Cotton Poplin', NULL, NULL),
(43, 43, 3, 'Cotton Poplin', NULL, NULL),
(44, 44, 3, 'Cotton Slub', NULL, NULL),
(45, 45, 3, 'Viscose', NULL, NULL),
(46, 46, 3, 'Katun Primisima', NULL, NULL),
(47, 47, 3, 'Knit Rib', NULL, NULL),
(48, 48, 3, 'Crepe', NULL, NULL),
(49, 49, 3, 'Plisket Polyester', NULL, NULL),
(50, 50, 3, 'Denim 8 oz', NULL, NULL),
(51, 51, 3, 'Span Twill', NULL, NULL),
(52, 52, 3, 'Linen Blend', NULL, NULL),
(53, 53, 3, 'Katun Batik', NULL, NULL),
(54, 54, 3, 'Linen Blend', NULL, NULL),
(55, 55, 3, 'Knit Wool Blend', NULL, NULL),
(56, 56, 3, 'Cotton Gabardine', NULL, NULL),
(57, 57, 3, 'Satin', NULL, NULL),
(58, 58, 3, 'Rayon', NULL, NULL),
(59, 59, 3, 'Kanvas 12 oz', NULL, NULL),
(60, 60, 3, 'Mesh & Sintetis', NULL, NULL),
(61, 61, 3, 'Kulit Sapi', NULL, NULL),
(62, 62, 3, 'Kulit Sintetis', NULL, NULL),
(63, 63, 3, 'Kulit Sapi', NULL, NULL),
(64, 64, 3, 'Kulit Suede', NULL, NULL),
(65, 65, 3, 'Kulit Nabuk', NULL, NULL),
(66, 66, 3, 'Knit Mesh', NULL, NULL),
(67, 67, 3, 'Kanvas', NULL, NULL),
(68, 68, 3, 'Kulit Sintetis', NULL, NULL),
(69, 69, 3, 'Denim', NULL, NULL),
(70, 70, 3, 'Kulit Sintetis', NULL, NULL),
(71, 71, 3, 'EVA', NULL, NULL),
(72, 72, 3, 'Kulit Sapi', NULL, NULL),
(73, 73, 3, 'Polyester Webbing', NULL, NULL),
(74, 74, 3, 'Kulit Sintetis', NULL, NULL),
(75, 75, 3, 'Kanvas 16 oz', NULL, NULL),
(76, 76, 3, 'Polyester 900D', NULL, NULL),
(77, 77, 3, 'Cordura', NULL, NULL),
(78, 78, 3, 'Nylon', NULL, NULL),
(79, 79, 3, 'Kulit Sapi', NULL, NULL),
(80, 80, 3, 'Kanvas 12 oz', NULL, NULL),
(81, 81, 3, 'Cordura 500D', NULL, NULL),
(82, 82, 3, 'Kulit Sapi', NULL, NULL),
(83, 83, 3, 'Ripstop Nylon', NULL, NULL),
(84, 84, 3, 'Nylon Quilted', NULL, NULL),
(85, 85, 3, 'Kanvas 14 oz', NULL, NULL),
(86, 86, 3, 'Kulit Sapi', NULL, NULL),
(87, 87, 3, 'Kulit Sapi', NULL, NULL),
(88, 88, 3, 'Kulit Sapi', NULL, NULL),
(89, 89, 3, 'Kanvas 12 oz', NULL, NULL),
(90, 90, 3, 'Stainless & Kulit', NULL, NULL),
(91, 91, 3, 'Stainless & Kulit', NULL, NULL),
(92, 92, 3, 'Resin', NULL, NULL),
(93, 93, 3, 'Stainless Steel', NULL, NULL),
(94, 94, 3, 'Stainless & Mesh', NULL, NULL),
(95, 95, 3, 'Acetate', NULL, NULL),
(96, 96, 3, 'Metal', NULL, NULL),
(97, 97, 3, 'Acetate', NULL, NULL),
(98, 98, 3, 'Stainless 316L', NULL, NULL),
(99, 99, 3, 'Batu Alam', NULL, NULL),
(100, 100, 3, 'Stainless 316L', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `product_categories`
--

CREATE TABLE `product_categories` (
  `product_id` bigint UNSIGNED NOT NULL,
  `category_id` bigint UNSIGNED NOT NULL,
  `is_primary` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_categories`
--

INSERT INTO `product_categories` (`product_id`, `category_id`, `is_primary`, `created_at`, `updated_at`) VALUES
(1, 3, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(2, 3, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(3, 3, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(4, 3, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(5, 3, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(6, 3, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(7, 3, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(8, 3, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(9, 3, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(10, 3, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(11, 4, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(12, 4, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(13, 4, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(14, 4, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(15, 4, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(16, 4, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(17, 4, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(18, 4, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(19, 5, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(20, 5, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(21, 5, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(22, 5, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(23, 5, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(24, 5, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(25, 6, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(26, 6, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(27, 6, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(28, 6, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(29, 6, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(30, 6, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(31, 6, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(32, 8, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(33, 8, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(34, 8, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(35, 8, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(36, 8, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(37, 8, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(38, 8, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(39, 8, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(40, 8, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(41, 9, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(42, 9, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(43, 9, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(44, 9, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(45, 9, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(46, 9, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(47, 9, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(48, 9, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(49, 10, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(50, 10, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(51, 10, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(52, 10, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(53, 10, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(54, 11, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(55, 11, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(56, 11, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(57, 11, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(58, 11, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(59, 14, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(60, 14, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(61, 14, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(62, 14, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(63, 14, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(64, 14, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(65, 14, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(66, 14, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(67, 14, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(68, 14, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(69, 14, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(70, 14, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(71, 15, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(72, 15, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(73, 15, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(74, 15, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(75, 17, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(76, 17, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(77, 17, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(78, 17, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(79, 17, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(80, 18, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(81, 18, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(82, 18, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(83, 18, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(84, 18, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(85, 18, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(86, 19, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(87, 19, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(88, 19, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(89, 19, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(90, 21, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(91, 21, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(92, 21, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(93, 21, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(94, 21, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(95, 22, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(96, 22, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(97, 22, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(98, 23, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(99, 23, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55'),
(100, 23, 1, '2026-11-14 02:23:55', '2026-11-14 02:23:55');

-- --------------------------------------------------------

--
-- Table structure for table `product_costings`
--

CREATE TABLE `product_costings` (
  `id` bigint UNSIGNED NOT NULL,
  `product_id` bigint UNSIGNED NOT NULL,
  `material_cost` decimal(18,4) NOT NULL DEFAULT '0.0000',
  `labor_cost` decimal(18,4) NOT NULL DEFAULT '0.0000',
  `overhead_cost` decimal(18,4) NOT NULL DEFAULT '0.0000',
  `other_cost` decimal(18,4) NOT NULL DEFAULT '0.0000',
  `hpp` decimal(18,4) NOT NULL DEFAULT '0.0000',
  `margin_percent` decimal(8,4) NOT NULL DEFAULT '0.0000',
  `suggested_price` decimal(18,2) NOT NULL DEFAULT '0.00',
  `selling_price` decimal(18,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_costings`
--

INSERT INTO `product_costings` (`id`, `product_id`, `material_cost`, `labor_cost`, `overhead_cost`, `other_cost`, `hpp`, `margin_percent`, `suggested_price`, `selling_price`, `created_at`, `updated_at`) VALUES
(1, 1, 28290.0000, 14240.0000, 6230.0000, 1780.0000, 50540.0000, 28.0000, 64691.20, 89000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(2, 2, 42830.0000, 20640.0000, 9030.0000, 2580.0000, 75080.0000, 29.0000, 96853.20, 129000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(3, 3, 61060.0000, 28640.0000, 12530.0000, 3580.0000, 105810.0000, 30.0000, 137553.00, 179000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(4, 4, 41470.0000, 19040.0000, 8330.0000, 2380.0000, 71220.0000, 31.0000, 93298.20, 119000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(5, 5, 32570.0000, 14240.0000, 6230.0000, 1780.0000, 54820.0000, 32.0000, 72362.40, 89000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(6, 6, 62940.0000, 27040.0000, 11830.0000, 3380.0000, 105190.0000, 33.0000, 139902.70, 169000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(7, 7, 71770.0000, 30240.0000, 13230.0000, 3780.0000, 119020.0000, 34.0000, 159486.80, 189000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(8, 8, 45987.5000, 19040.0000, 8330.0000, 2380.0000, 75737.5000, 35.0000, 102245.63, 119000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(9, 9, 78780.0000, 31840.0000, 13930.0000, 3980.0000, 128530.0000, 36.0000, 174800.80, 199000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(10, 10, 32085.0000, 12640.0000, 5530.0000, 1580.0000, 51835.0000, 37.0000, 71013.95, 79000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(11, 11, 78840.0000, 30240.0000, 13230.0000, 3780.0000, 126090.0000, 38.0000, 174004.20, 189000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(12, 12, 111420.0000, 41440.0000, 18130.0000, 5180.0000, 176170.0000, 39.0000, 244876.30, 259000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(13, 13, 92495.0000, 46240.0000, 20230.0000, 5780.0000, 164745.0000, 40.0000, 230643.00, 289000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(14, 14, 81756.0000, 39840.0000, 17430.0000, 4980.0000, 144006.0000, 41.0000, 203048.46, 249000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(15, 15, 118580.0000, 55840.0000, 24430.0000, 6980.0000, 205830.0000, 42.0000, 292278.60, 349000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(16, 16, 97720.0000, 44640.0000, 19530.0000, 5580.0000, 167470.0000, 43.0000, 239482.10, 279000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(17, 17, 78550.0000, 35040.0000, 15330.0000, 4380.0000, 133300.0000, 44.0000, 191952.00, 219000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(18, 18, 91595.0000, 39840.0000, 17430.0000, 4980.0000, 153845.0000, 45.0000, 223075.25, 249000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(19, 19, 124545.0000, 52640.0000, 23030.0000, 6580.0000, 206795.0000, 28.0000, 264697.60, 329000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(20, 20, 214080.0000, 87840.0000, 38430.0000, 10980.0000, 351330.0000, 29.0000, 453215.70, 549000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(21, 21, 183570.0000, 73440.0000, 32130.0000, 9180.0000, 298320.0000, 30.0000, 387816.00, 459000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(22, 22, 204641.0000, 79840.0000, 34930.0000, 9980.0000, 329391.0000, 31.0000, 431502.21, 499000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(23, 23, 180840.0000, 68640.0000, 30030.0000, 8580.0000, 288090.0000, 32.0000, 380278.80, 429000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(24, 24, 137440.0000, 51040.0000, 22330.0000, 6380.0000, 217190.0000, 33.0000, 288862.70, 319000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(25, 25, 63720.0000, 31840.0000, 13930.0000, 3980.0000, 113470.0000, 34.0000, 152049.80, 199000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(26, 26, 108650.0000, 52640.0000, 23030.0000, 6580.0000, 190900.0000, 35.0000, 257715.00, 329000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(27, 27, 101667.5000, 47840.0000, 20930.0000, 5980.0000, 176417.5000, 36.0000, 239927.80, 299000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(28, 28, 161244.0000, 73440.0000, 32130.0000, 9180.0000, 275994.0000, 37.0000, 378111.78, 459000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(29, 29, 71690.0000, 31840.0000, 13930.0000, 3980.0000, 121440.0000, 38.0000, 167587.20, 199000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(30, 30, 103750.0000, 44640.0000, 19530.0000, 5580.0000, 173500.0000, 39.0000, 241165.00, 279000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(31, 31, 109275.0000, 46240.0000, 20230.0000, 5780.0000, 181525.0000, 40.0000, 254135.00, 289000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(32, 32, 108625.0000, 44640.0000, 19530.0000, 5580.0000, 178375.0000, 41.0000, 251508.75, 279000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(33, 33, 115600.0000, 46240.0000, 20230.0000, 5780.0000, 187850.0000, 42.0000, 266747.00, 289000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(34, 34, 122280.0000, 47840.0000, 20930.0000, 5980.0000, 197030.0000, 43.0000, 281752.90, 299000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(35, 35, 146470.0000, 55840.0000, 24430.0000, 6980.0000, 233720.0000, 44.0000, 336556.80, 349000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(36, 36, 154508.5000, 57440.0000, 25130.0000, 7180.0000, 244258.5000, 45.0000, 354174.83, 359000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(37, 37, 81690.0000, 41440.0000, 18130.0000, 5180.0000, 146440.0000, 28.0000, 187443.20, 259000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(38, 38, 65590.0000, 31840.0000, 13930.0000, 3980.0000, 115340.0000, 29.0000, 148788.60, 199000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(39, 39, 109080.0000, 51040.0000, 22330.0000, 6380.0000, 188830.0000, 30.0000, 245479.00, 319000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(40, 40, 90785.0000, 41440.0000, 18130.0000, 5180.0000, 155535.0000, 31.0000, 203750.85, 259000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(41, 41, 75250.0000, 33440.0000, 14630.0000, 4180.0000, 127500.0000, 32.0000, 168300.00, 209000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(42, 42, 81042.0000, 35040.0000, 15330.0000, 4380.0000, 135792.0000, 33.0000, 180603.36, 219000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(43, 43, 86800.0000, 36640.0000, 16030.0000, 4580.0000, 144050.0000, 34.0000, 193027.00, 229000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(44, 44, 53850.0000, 22240.0000, 9730.0000, 2780.0000, 88600.0000, 35.0000, 119610.00, 139000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(45, 45, 83925.0000, 33440.0000, 14630.0000, 4180.0000, 136175.0000, 36.0000, 185198.00, 209000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(46, 46, 98600.0000, 38240.0000, 16730.0000, 4780.0000, 158350.0000, 37.0000, 216939.50, 239000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(47, 47, 78900.0000, 30240.0000, 13230.0000, 3780.0000, 126150.0000, 38.0000, 174087.00, 189000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(48, 48, 115860.0000, 43040.0000, 18830.0000, 5380.0000, 183110.0000, 39.0000, 254522.90, 269000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(49, 49, 60380.0000, 30240.0000, 13230.0000, 3780.0000, 107630.0000, 40.0000, 150682.00, 189000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(50, 50, 89086.5000, 43040.0000, 18830.0000, 5380.0000, 156336.5000, 41.0000, 220434.47, 269000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(51, 51, 67140.0000, 31840.0000, 13930.0000, 3980.0000, 116890.0000, 42.0000, 165983.80, 199000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(52, 52, 84075.0000, 38240.0000, 16730.0000, 4780.0000, 143825.0000, 43.0000, 205669.75, 239000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(53, 53, 92880.0000, 41440.0000, 18130.0000, 5180.0000, 157630.0000, 44.0000, 226987.20, 259000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(54, 54, 132845.0000, 57440.0000, 25130.0000, 7180.0000, 222595.0000, 45.0000, 322762.75, 359000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(55, 55, 113624.0000, 47840.0000, 20930.0000, 5980.0000, 188374.0000, 28.0000, 241118.72, 299000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(56, 56, 214527.0000, 87840.0000, 38430.0000, 10980.0000, 351777.0000, 29.0000, 453792.33, 549000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(57, 57, 151325.0000, 60640.0000, 26530.0000, 7580.0000, 246075.0000, 30.0000, 319897.50, 379000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(58, 58, 113730.0000, 44640.0000, 19530.0000, 5580.0000, 183480.0000, 31.0000, 240358.80, 279000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(59, 59, 104890.0000, 39840.0000, 17430.0000, 4980.0000, 167140.0000, 32.0000, 220624.80, 249000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(60, 60, 193215.0000, 71840.0000, 31430.0000, 8980.0000, 305465.0000, 33.0000, 406268.45, 449000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(61, 61, 207575.0000, 103840.0000, 45430.0000, 12980.0000, 369825.0000, 34.0000, 495565.50, 649000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(62, 62, 124680.0000, 60640.0000, 26530.0000, 7580.0000, 219430.0000, 35.0000, 296230.50, 379000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(63, 63, 220795.0000, 103840.0000, 45430.0000, 12980.0000, 383045.0000, 36.0000, 520941.20, 649000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(64, 64, 174368.0000, 79840.0000, 34930.0000, 9980.0000, 299118.0000, 37.0000, 409791.66, 499000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(65, 65, 322810.0000, 143840.0000, 62930.0000, 17980.0000, 547560.0000, 38.0000, 755632.80, 899000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(66, 66, 169650.0000, 73440.0000, 32130.0000, 9180.0000, 284400.0000, 39.0000, 395316.00, 459000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(67, 67, 135810.0000, 57440.0000, 25130.0000, 7180.0000, 225560.0000, 40.0000, 315784.00, 359000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(68, 68, 128430.0000, 52640.0000, 23030.0000, 6580.0000, 210680.0000, 41.0000, 297058.80, 329000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(69, 69, 131613.5000, 52640.0000, 23030.0000, 6580.0000, 213863.5000, 42.0000, 303686.17, 329000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(70, 70, 122235.0000, 47840.0000, 20930.0000, 5980.0000, 196985.0000, 43.0000, 281688.55, 299000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(71, 71, 49600.0000, 19040.0000, 8330.0000, 2380.0000, 79350.0000, 44.0000, 114264.00, 119000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(72, 72, 119760.0000, 44640.0000, 19530.0000, 5580.0000, 189510.0000, 45.0000, 274789.50, 279000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(73, 73, 80060.0000, 39840.0000, 17430.0000, 4980.0000, 142310.0000, 28.0000, 182156.80, 249000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(74, 74, 108625.0000, 52640.0000, 23030.0000, 6580.0000, 190875.0000, 29.0000, 246228.75, 329000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(75, 75, 101840.0000, 47840.0000, 20930.0000, 5980.0000, 176590.0000, 30.0000, 229567.00, 299000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(76, 76, 149940.0000, 68640.0000, 30030.0000, 8580.0000, 257190.0000, 31.0000, 336918.90, 429000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(77, 77, 154385.0000, 68640.0000, 30030.0000, 8580.0000, 261635.0000, 32.0000, 345358.20, 429000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(78, 78, 91711.5000, 39840.0000, 17430.0000, 4980.0000, 153961.5000, 33.0000, 204768.80, 249000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(79, 79, 208070.0000, 87840.0000, 38430.0000, 10980.0000, 345320.0000, 34.0000, 462728.80, 549000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(80, 80, 65715.0000, 27040.0000, 11830.0000, 3380.0000, 107965.0000, 35.0000, 145752.75, 169000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(81, 81, 107190.0000, 43040.0000, 18830.0000, 5380.0000, 174440.0000, 36.0000, 237238.40, 269000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(82, 82, 155460.0000, 60640.0000, 26530.0000, 7580.0000, 250210.0000, 37.0000, 342787.70, 379000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(83, 83, 100373.0000, 38240.0000, 16730.0000, 4780.0000, 160123.0000, 38.0000, 220969.74, 239000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(84, 84, 81210.0000, 30240.0000, 13230.0000, 3780.0000, 128460.0000, 39.0000, 178559.40, 189000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(85, 85, 99200.0000, 49440.0000, 21630.0000, 6180.0000, 176450.0000, 40.0000, 247030.00, 309000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(86, 86, 54890.0000, 27040.0000, 11830.0000, 3380.0000, 97140.0000, 41.0000, 136967.40, 169000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(87, 87, 95325.0000, 44640.0000, 19530.0000, 5580.0000, 165075.0000, 42.0000, 234406.50, 279000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(88, 88, 41470.0000, 19040.0000, 8330.0000, 2380.0000, 71220.0000, 43.0000, 101844.60, 119000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(89, 89, 46330.0000, 20640.0000, 9030.0000, 2580.0000, 78580.0000, 44.0000, 113155.20, 129000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(90, 90, 133080.0000, 57440.0000, 25130.0000, 7180.0000, 222830.0000, 45.0000, 323103.50, 359000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(91, 91, 185705.0000, 78240.0000, 34230.0000, 9780.0000, 307955.0000, 28.0000, 394182.40, 489000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(92, 92, 117210.5000, 47840.0000, 20930.0000, 5980.0000, 191960.5000, 29.0000, 247629.05, 299000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(93, 93, 210980.0000, 84640.0000, 37030.0000, 10580.0000, 343230.0000, 30.0000, 446199.00, 529000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(94, 94, 245170.0000, 95840.0000, 41930.0000, 11980.0000, 394920.0000, 31.0000, 517345.20, 599000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(95, 95, 96120.0000, 36640.0000, 16030.0000, 4580.0000, 153370.0000, 32.0000, 202448.40, 229000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(96, 96, 141415.0000, 52640.0000, 23030.0000, 6580.0000, 223665.0000, 33.0000, 297474.45, 329000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(97, 97, 79684.0000, 39840.0000, 17430.0000, 4980.0000, 141934.0000, 34.0000, 190191.56, 249000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(98, 98, 49452.0000, 23840.0000, 10430.0000, 2980.0000, 86702.0000, 35.0000, 117047.70, 149000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(99, 99, 43400.0000, 20640.0000, 9030.0000, 2580.0000, 75650.0000, 36.0000, 102884.00, 129000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(100, 100, 27860.0000, 12640.0000, 5530.0000, 1580.0000, 47610.0000, 37.0000, 65225.70, 79000.00, '2026-11-14 02:24:37', '2026-11-14 02:24:37');

-- --------------------------------------------------------

--
-- Table structure for table `product_costing_impacts`
--

CREATE TABLE `product_costing_impacts` (
  `id` bigint UNSIGNED NOT NULL,
  `product_id` bigint UNSIGNED NOT NULL,
  `raw_material_id` bigint UNSIGNED DEFAULT NULL,
  `raw_material_cost_history_id` bigint UNSIGNED DEFAULT NULL,
  `old_material_cost` decimal(18,4) NOT NULL DEFAULT '0.0000',
  `new_material_cost` decimal(18,4) NOT NULL DEFAULT '0.0000',
  `old_hpp` decimal(18,4) NOT NULL DEFAULT '0.0000',
  `new_hpp` decimal(18,4) NOT NULL DEFAULT '0.0000',
  `hpp_change_amount` decimal(18,4) NOT NULL DEFAULT '0.0000',
  `hpp_change_percent` decimal(12,4) NOT NULL DEFAULT '0.0000',
  `old_suggested_price` decimal(18,2) NOT NULL DEFAULT '0.00',
  `new_suggested_price` decimal(18,2) NOT NULL DEFAULT '0.00',
  `trigger_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'raw_material_cost_change',
  `occurred_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_costing_impacts`
--

INSERT INTO `product_costing_impacts` (`id`, `product_id`, `raw_material_id`, `raw_material_cost_history_id`, `old_material_cost`, `new_material_cost`, `old_hpp`, `new_hpp`, `hpp_change_amount`, `hpp_change_percent`, `old_suggested_price`, `new_suggested_price`, `trigger_type`, `occurred_at`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 2, 26309.7000, 28290.0000, 47507.6000, 50540.0000, 3032.4000, 6.3830, 60809.73, 64691.20, 'raw_material_cost_change', '2026-11-11 02:24:37', '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(2, 14, 14, 28, 76033.0800, 81756.0000, 135365.6400, 144006.0000, 8640.3600, 6.3830, 190865.55, 203048.46, 'raw_material_cost_change', '2026-11-10 02:24:37', '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(3, 27, 13, 26, 94550.7800, 101667.5000, 165832.4500, 176417.5000, 10585.0500, 6.3830, 225532.13, 239927.80, 'raw_material_cost_change', '2026-11-09 02:24:37', '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(4, 40, 12, 24, 84430.0500, 90785.0000, 146202.9000, 155535.0000, 9332.1000, 6.3830, 191525.80, 203750.85, 'raw_material_cost_change', '2026-11-08 02:24:37', '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(5, 53, 11, 22, 86378.4000, 92880.0000, 148172.2000, 157630.0000, 9457.8000, 6.3830, 213367.97, 226987.20, 'raw_material_cost_change', '2026-11-07 02:24:37', '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(6, 66, 10, 20, 157774.5000, 169650.0000, 267336.0000, 284400.0000, 17064.0000, 6.3830, 371597.04, 395316.00, 'raw_material_cost_change', '2026-11-11 02:24:37', '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(7, 79, 9, 18, 193505.1000, 208070.0000, 324600.8000, 345320.0000, 20719.2000, 6.3830, 434965.07, 462728.80, 'raw_material_cost_change', '2026-11-10 02:24:37', '2026-11-14 02:24:37', '2026-11-14 02:24:37');

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `id` bigint UNSIGNED NOT NULL,
  `product_id` bigint UNSIGNED NOT NULL,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alt_text` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_primary` tinyint(1) NOT NULL DEFAULT '0',
  `sort_order` int UNSIGNED NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `url`, `alt_text`, `is_primary`, `sort_order`, `created_at`, `updated_at`) VALUES
(1, 1, 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&h=900&q=80', 'Kaos Polos Cotton Combed 24s Hitam — foto 1', 1, 1, '2026-11-14 00:23:55', '2026-11-14 00:23:55'),
(2, 1, 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=900&h=1200&q=80', 'Kaos Polos Cotton Combed 24s Hitam — foto 2', 0, 2, '2026-11-14 00:23:55', '2026-11-14 00:23:55'),
(3, 1, 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&h=1200&q=80', 'Kaos Polos Cotton Combed 24s Hitam — foto 3', 0, 3, '2026-11-14 00:23:55', '2026-11-14 00:23:55'),
(4, 2, 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=900&h=900&q=80', 'Kaos Oversize Drop Shoulder Cream — foto 1', 1, 1, '2026-11-13 19:23:55', '2026-11-13 19:23:55'),
(5, 2, 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&h=1200&q=80', 'Kaos Oversize Drop Shoulder Cream — foto 2', 0, 2, '2026-11-13 19:23:55', '2026-11-13 19:23:55'),
(6, 2, 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&h=1200&q=80', 'Kaos Oversize Drop Shoulder Cream — foto 3', 0, 3, '2026-11-13 19:23:55', '2026-11-13 19:23:55'),
(7, 3, 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&h=900&q=80', 'Kaos Lengan Panjang Heavyweight Doff Abu — foto 1', 1, 1, '2026-11-13 14:23:55', '2026-11-13 14:23:55'),
(8, 3, 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&h=1200&q=80', 'Kaos Lengan Panjang Heavyweight Doff Abu — foto 2', 0, 2, '2026-11-13 14:23:55', '2026-11-13 14:23:55'),
(9, 3, 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=900&h=1200&q=80', 'Kaos Lengan Panjang Heavyweight Doff Abu — foto 3', 0, 3, '2026-11-13 14:23:55', '2026-11-13 14:23:55'),
(10, 4, 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&h=900&q=80', 'Kaos Raglan Cotton Blend Navy — foto 1', 1, 1, '2026-11-13 09:23:55', '2026-11-13 09:23:55'),
(11, 4, 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=900&h=1200&q=80', 'Kaos Raglan Cotton Blend Navy — foto 2', 0, 2, '2026-11-13 09:23:55', '2026-11-13 09:23:55'),
(12, 4, 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=900&h=1200&q=80', 'Kaos Raglan Cotton Blend Navy — foto 3', 0, 3, '2026-11-13 09:23:55', '2026-11-13 09:23:55'),
(13, 5, 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=900&h=900&q=80', 'Kaos Premium Combed 30s Putih — foto 1', 1, 1, '2026-11-13 04:23:55', '2026-11-13 04:23:55'),
(14, 5, 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=900&h=1200&q=80', 'Kaos Premium Combed 30s Putih — foto 2', 0, 2, '2026-11-13 04:23:55', '2026-11-13 04:23:55'),
(15, 5, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&h=1200&q=80', 'Kaos Premium Combed 30s Putih — foto 3', 0, 3, '2026-11-13 04:23:55', '2026-11-13 04:23:55'),
(16, 6, 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=900&h=900&q=80', 'Kaos Oversize Graphic Slow Living Sand — foto 1', 1, 1, '2026-11-12 23:23:55', '2026-11-12 23:23:55'),
(17, 6, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&h=1200&q=80', 'Kaos Oversize Graphic Slow Living Sand — foto 2', 0, 2, '2026-11-12 23:23:55', '2026-11-12 23:23:55'),
(18, 6, 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&h=1200&q=80', 'Kaos Oversize Graphic Slow Living Sand — foto 3', 0, 3, '2026-11-12 23:23:55', '2026-11-12 23:23:55'),
(19, 7, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&h=900&q=80', 'Kaos Turtle Neck Rib Hitam — foto 1', 1, 1, '2026-11-12 18:23:55', '2026-11-12 18:23:55'),
(20, 7, 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&h=1200&q=80', 'Kaos Turtle Neck Rib Hitam — foto 2', 0, 2, '2026-11-12 18:23:55', '2026-11-12 18:23:55'),
(21, 7, 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=900&h=1200&q=80', 'Kaos Turtle Neck Rib Hitam — foto 3', 0, 3, '2026-11-12 18:23:55', '2026-11-12 18:23:55'),
(22, 8, 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&h=900&q=80', 'Kaos Crop Boxy Sage — foto 1', 1, 1, '2026-11-12 13:23:55', '2026-11-12 13:23:55'),
(23, 8, 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=900&h=1200&q=80', 'Kaos Crop Boxy Sage — foto 2', 0, 2, '2026-11-12 13:23:55', '2026-11-12 13:23:55'),
(24, 8, 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&h=1200&q=80', 'Kaos Crop Boxy Sage — foto 3', 0, 3, '2026-11-12 13:23:55', '2026-11-12 13:23:55'),
(25, 9, 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=900&h=900&q=80', 'Kaos Polo Knit Sand — foto 1', 1, 1, '2026-11-12 09:44:00', '2026-11-12 09:44:00'),
(26, 9, 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&h=1200&q=80', 'Kaos Polo Knit Sand — foto 2', 0, 2, '2026-11-12 09:44:00', '2026-11-12 09:44:00'),
(27, 9, 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&h=1200&q=80', 'Kaos Polo Knit Sand — foto 3', 0, 3, '2026-11-12 09:44:00', '2026-11-12 09:44:00'),
(28, 10, 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&h=900&q=80', 'Kaos Undershirt Viscose Putih — foto 1', 1, 1, '2026-11-10 10:57:00', '2026-11-10 10:57:00'),
(29, 10, 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&h=1200&q=80', 'Kaos Undershirt Viscose Putih — foto 2', 0, 2, '2026-11-10 10:57:00', '2026-11-10 10:57:00'),
(30, 10, 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=900&h=1200&q=80', 'Kaos Undershirt Viscose Putih — foto 3', 0, 3, '2026-11-10 10:57:00', '2026-11-10 10:57:00'),
(31, 11, 'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=900&h=900&q=80', 'Kemeja Flannel Kotak Maroon — foto 1', 1, 1, '2026-11-08 01:10:00', '2026-11-08 01:10:00'),
(32, 11, 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&h=1200&q=80', 'Kemeja Flannel Kotak Maroon — foto 2', 0, 2, '2026-11-08 01:10:00', '2026-11-08 01:10:00'),
(33, 11, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&h=1200&q=80', 'Kemeja Flannel Kotak Maroon — foto 3', 0, 3, '2026-11-08 01:10:00', '2026-11-08 01:10:00'),
(34, 12, 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&h=900&q=80', 'Kemeja Oxford Slim Fit Putih — foto 1', 1, 1, '2026-11-06 02:23:00', '2026-11-06 02:23:00'),
(35, 12, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&h=1200&q=80', 'Kemeja Oxford Slim Fit Putih — foto 2', 0, 2, '2026-11-06 02:23:00', '2026-11-06 02:23:00'),
(36, 12, 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=900&h=1200&q=80', 'Kemeja Oxford Slim Fit Putih — foto 3', 0, 3, '2026-11-06 02:23:00', '2026-11-06 02:23:00'),
(37, 13, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&h=900&q=80', 'Kemeja Linen Oversize Khaki — foto 1', 1, 1, '2026-11-04 03:36:00', '2026-11-04 03:36:00'),
(38, 13, 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=900&h=1200&q=80', 'Kemeja Linen Oversize Khaki — foto 2', 0, 2, '2026-11-04 03:36:00', '2026-11-04 03:36:00'),
(39, 13, 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=900&h=1200&q=80', 'Kemeja Linen Oversize Khaki — foto 3', 0, 3, '2026-11-04 03:36:00', '2026-11-04 03:36:00'),
(40, 14, 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=900&h=900&q=80', 'Kemeja Denim Washed Biru — foto 1', 1, 1, '2026-11-02 04:49:00', '2026-11-02 04:49:00'),
(41, 14, 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=900&h=1200&q=80', 'Kemeja Denim Washed Biru — foto 2', 0, 2, '2026-11-02 04:49:00', '2026-11-02 04:49:00'),
(42, 14, 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&h=1200&q=80', 'Kemeja Denim Washed Biru — foto 3', 0, 3, '2026-11-02 04:49:00', '2026-11-02 04:49:00'),
(43, 15, 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=900&h=900&q=80', 'Kemeja Batik Lengan Panjang Parang — foto 1', 1, 1, '2026-10-31 05:02:00', '2026-10-31 05:02:00'),
(44, 15, 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&h=1200&q=80', 'Kemeja Batik Lengan Panjang Parang — foto 2', 0, 2, '2026-10-31 05:02:00', '2026-10-31 05:02:00'),
(45, 15, 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&h=1200&q=80', 'Kemeja Batik Lengan Panjang Parang — foto 3', 0, 3, '2026-10-31 05:02:00', '2026-10-31 05:02:00'),
(46, 16, 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&h=900&q=80', 'Kemeja Corduroy Cokelat Tua — foto 1', 1, 1, '2026-10-29 06:15:00', '2026-10-29 06:15:00'),
(47, 16, 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&h=1200&q=80', 'Kemeja Corduroy Cokelat Tua — foto 2', 0, 2, '2026-10-29 06:15:00', '2026-10-29 06:15:00'),
(48, 16, 'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=900&h=1200&q=80', 'Kemeja Corduroy Cokelat Tua — foto 3', 0, 3, '2026-10-29 06:15:00', '2026-10-29 06:15:00'),
(49, 17, 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&h=900&q=80', 'Kemeja Twill Asimetri Navy — foto 1', 1, 1, '2026-10-27 07:28:00', '2026-10-27 07:28:00'),
(50, 17, 'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=900&h=1200&q=80', 'Kemeja Twill Asimetri Navy — foto 2', 0, 2, '2026-10-27 07:28:00', '2026-10-27 07:28:00'),
(51, 17, 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&h=1200&q=80', 'Kemeja Twill Asimetri Navy — foto 3', 0, 3, '2026-10-27 07:28:00', '2026-10-27 07:28:00'),
(52, 18, 'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=900&h=900&q=80', 'Kemeja Camp Shirt Bunga Hutan — foto 1', 1, 1, '2026-10-25 08:41:00', '2026-10-25 08:41:00'),
(53, 18, 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&h=1200&q=80', 'Kemeja Camp Shirt Bunga Hutan — foto 2', 0, 2, '2026-10-25 08:41:00', '2026-10-25 08:41:00'),
(54, 18, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&h=1200&q=80', 'Kemeja Camp Shirt Bunga Hutan — foto 3', 0, 3, '2026-10-25 08:41:00', '2026-10-25 08:41:00'),
(55, 19, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&h=900&q=80', 'Jaket Denim Oversize Blue Washed — foto 1', 1, 1, '2026-10-23 09:54:00', '2026-10-23 09:54:00'),
(56, 19, 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&h=1200&q=80', 'Jaket Denim Oversize Blue Washed — foto 2', 0, 2, '2026-10-23 09:54:00', '2026-10-23 09:54:00'),
(57, 19, 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=900&h=1200&q=80', 'Jaket Denim Oversize Blue Washed — foto 3', 0, 3, '2026-10-23 09:54:00', '2026-10-23 09:54:00'),
(58, 20, 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&h=900&q=80', 'Jaket Varsity Wool Blend Navy Cream — foto 1', 1, 1, '2026-10-21 10:07:00', '2026-10-21 10:07:00'),
(59, 20, 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=900&h=1200&q=80', 'Jaket Varsity Wool Blend Navy Cream — foto 2', 0, 2, '2026-10-21 10:07:00', '2026-10-21 10:07:00'),
(60, 20, 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=900&h=1200&q=80', 'Jaket Varsity Wool Blend Navy Cream — foto 3', 0, 3, '2026-10-21 10:07:00', '2026-10-21 10:07:00'),
(61, 21, 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=900&h=900&q=80', 'Jaket Bomber Ripstop Hitam — foto 1', 1, 1, '2026-10-19 01:20:00', '2026-10-19 01:20:00'),
(62, 21, 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=900&h=1200&q=80', 'Jaket Bomber Ripstop Hitam — foto 2', 0, 2, '2026-10-19 01:20:00', '2026-10-19 01:20:00'),
(63, 21, 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&h=1200&q=80', 'Jaket Bomber Ripstop Hitam — foto 3', 0, 3, '2026-10-19 01:20:00', '2026-10-19 01:20:00'),
(64, 22, 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=900&h=900&q=80', 'Jaket Hiking Softshell Abu — foto 1', 1, 1, '2026-10-17 02:33:00', '2026-10-17 02:33:00'),
(65, 22, 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&h=1200&q=80', 'Jaket Hiking Softshell Abu — foto 2', 0, 2, '2026-10-17 02:33:00', '2026-10-17 02:33:00'),
(66, 22, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&h=1200&q=80', 'Jaket Hiking Softshell Abu — foto 3', 0, 3, '2026-10-17 02:33:00', '2026-10-17 02:33:00'),
(67, 23, 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&h=900&q=80', 'Jaket Kanvas Kerja Cokelat — foto 1', 1, 1, '2026-10-15 03:46:00', '2026-10-15 03:46:00'),
(68, 23, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&h=1200&q=80', 'Jaket Kanvas Kerja Cokelat — foto 2', 0, 2, '2026-10-15 03:46:00', '2026-10-15 03:46:00'),
(69, 23, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&h=1200&q=80', 'Jaket Kanvas Kerja Cokelat — foto 3', 0, 3, '2026-10-15 03:46:00', '2026-10-15 03:46:00'),
(70, 24, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&h=900&q=80', 'Jaket Harrington Cotton Navy — foto 1', 1, 1, '2026-10-13 04:59:00', '2026-10-13 04:59:00'),
(71, 24, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&h=1200&q=80', 'Jaket Harrington Cotton Navy — foto 2', 0, 2, '2026-10-13 04:59:00', '2026-10-13 04:59:00'),
(72, 24, 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&h=1200&q=80', 'Jaket Harrington Cotton Navy — foto 3', 0, 3, '2026-10-13 04:59:00', '2026-10-13 04:59:00'),
(73, 25, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&h=900&q=80', 'Celana Chino Slim Fit Khaki — foto 1', 1, 1, '2026-10-11 05:12:00', '2026-10-11 05:12:00'),
(74, 25, 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&h=1200&q=80', 'Celana Chino Slim Fit Khaki — foto 2', 0, 2, '2026-10-11 05:12:00', '2026-10-11 05:12:00'),
(75, 25, 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=900&h=1200&q=80', 'Celana Chino Slim Fit Khaki — foto 3', 0, 3, '2026-10-11 05:12:00', '2026-10-11 05:12:00'),
(76, 26, 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&h=900&q=80', 'Celana Jeans Straight Leg Indigo — foto 1', 1, 1, '2026-10-09 06:25:00', '2026-10-09 06:25:00'),
(77, 26, 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=900&h=1200&q=80', 'Celana Jeans Straight Leg Indigo — foto 2', 0, 2, '2026-10-09 06:25:00', '2026-10-09 06:25:00'),
(78, 26, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&h=1200&q=80', 'Celana Jeans Straight Leg Indigo — foto 3', 0, 3, '2026-10-09 06:25:00', '2026-10-09 06:25:00'),
(79, 27, 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=900&h=900&q=80', 'Celana Cargo Ripstop Olive — foto 1', 1, 1, '2026-10-07 07:38:00', '2026-10-07 07:38:00'),
(80, 27, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&h=1200&q=80', 'Celana Cargo Ripstop Olive — foto 2', 0, 2, '2026-10-07 07:38:00', '2026-10-07 07:38:00'),
(81, 27, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&h=1200&q=80', 'Celana Cargo Ripstop Olive — foto 3', 0, 3, '2026-10-07 07:38:00', '2026-10-07 07:38:00'),
(82, 28, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&h=900&q=80', 'Celana Formal Wool Blend Hitam — foto 1', 1, 1, '2026-10-05 08:51:00', '2026-10-05 08:51:00'),
(83, 28, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&h=1200&q=80', 'Celana Formal Wool Blend Hitam — foto 2', 0, 2, '2026-10-05 08:51:00', '2026-10-05 08:51:00'),
(84, 28, 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&h=1200&q=80', 'Celana Formal Wool Blend Hitam — foto 3', 0, 3, '2026-10-05 08:51:00', '2026-10-05 08:51:00'),
(85, 29, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&h=900&q=80', 'Celana Training Sweatpant Grey — foto 1', 1, 1, '2026-10-03 09:04:00', '2026-10-03 09:04:00'),
(86, 29, 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&h=1200&q=80', 'Celana Training Sweatpant Grey — foto 2', 0, 2, '2026-10-03 09:04:00', '2026-10-03 09:04:00'),
(87, 29, 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=900&h=1200&q=80', 'Celana Training Sweatpant Grey — foto 3', 0, 3, '2026-10-03 09:04:00', '2026-10-03 09:04:00'),
(88, 30, 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&h=900&q=80', 'Celana Panjang Kanvas Cokelat — foto 1', 1, 1, '2026-10-01 10:17:00', '2026-10-01 10:17:00'),
(89, 30, 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=900&h=1200&q=80', 'Celana Panjang Kanvas Cokelat — foto 2', 0, 2, '2026-10-01 10:17:00', '2026-10-01 10:17:00'),
(90, 30, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&h=1200&q=80', 'Celana Panjang Kanvas Cokelat — foto 3', 0, 3, '2026-10-01 10:17:00', '2026-10-01 10:17:00'),
(91, 31, 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=900&h=900&q=80', 'Celana Jeans Slim Stretch Black — foto 1', 1, 1, '2026-09-29 01:30:00', '2026-09-29 01:30:00'),
(92, 31, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&h=1200&q=80', 'Celana Jeans Slim Stretch Black — foto 2', 0, 2, '2026-09-29 01:30:00', '2026-09-29 01:30:00'),
(93, 31, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&h=1200&q=80', 'Celana Jeans Slim Stretch Black — foto 3', 0, 3, '2026-09-29 01:30:00', '2026-09-29 01:30:00'),
(94, 32, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&h=900&q=80', 'Dress Midi Linen Krem — foto 1', 1, 1, '2026-09-27 02:43:00', '2026-09-27 02:43:00'),
(95, 32, 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?auto=format&fit=crop&w=900&h=1200&q=80', 'Dress Midi Linen Krem — foto 2', 0, 2, '2026-09-27 02:43:00', '2026-09-27 02:43:00'),
(96, 32, 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&h=1200&q=80', 'Dress Midi Linen Krem — foto 3', 0, 3, '2026-09-27 02:43:00', '2026-09-27 02:43:00'),
(97, 33, 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?auto=format&fit=crop&w=900&h=900&q=80', 'Dress Slip Satin Champagne — foto 1', 1, 1, '2026-09-25 03:56:00', '2026-09-25 03:56:00'),
(98, 33, 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&h=1200&q=80', 'Dress Slip Satin Champagne — foto 2', 0, 2, '2026-09-25 03:56:00', '2026-09-25 03:56:00'),
(99, 33, 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&h=1200&q=80', 'Dress Slip Satin Champagne — foto 3', 0, 3, '2026-09-25 03:56:00', '2026-09-25 03:56:00'),
(100, 34, 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&h=900&q=80', 'Dress Wrap Floral Sage — foto 1', 1, 1, '2026-09-23 04:09:00', '2026-09-23 04:09:00'),
(101, 34, 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&h=1200&q=80', 'Dress Wrap Floral Sage — foto 2', 0, 2, '2026-09-23 04:09:00', '2026-09-23 04:09:00'),
(102, 34, 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&h=1200&q=80', 'Dress Wrap Floral Sage — foto 3', 0, 3, '2026-09-23 04:09:00', '2026-09-23 04:09:00'),
(103, 35, 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&h=900&q=80', 'Dress Shirt Midi Denim Light — foto 1', 1, 1, '2026-09-21 05:22:00', '2026-09-21 05:22:00'),
(104, 35, 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&h=1200&q=80', 'Dress Shirt Midi Denim Light — foto 2', 0, 2, '2026-09-21 05:22:00', '2026-09-21 05:22:00'),
(105, 35, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&h=1200&q=80', 'Dress Shirt Midi Denim Light — foto 3', 0, 3, '2026-09-21 05:22:00', '2026-09-21 05:22:00'),
(106, 36, 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&h=900&q=80', 'Dress Maxi Katun Batik Parang — foto 1', 1, 1, '2026-09-19 06:35:00', '2026-09-19 06:35:00'),
(107, 36, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&h=1200&q=80', 'Dress Maxi Katun Batik Parang — foto 2', 0, 2, '2026-09-19 06:35:00', '2026-09-19 06:35:00'),
(108, 36, 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&h=1200&q=80', 'Dress Maxi Katun Batik Parang — foto 3', 0, 3, '2026-09-19 06:35:00', '2026-09-19 06:35:00'),
(109, 37, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&h=900&q=80', 'Dress Bodycon Rib Hitam — foto 1', 1, 1, '2026-09-17 07:48:00', '2026-09-17 07:48:00'),
(110, 37, 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&h=1200&q=80', 'Dress Bodycon Rib Hitam — foto 2', 0, 2, '2026-09-17 07:48:00', '2026-09-17 07:48:00'),
(111, 37, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&h=1200&q=80', 'Dress Bodycon Rib Hitam — foto 3', 0, 3, '2026-09-17 07:48:00', '2026-09-17 07:48:00'),
(112, 38, 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&h=900&q=80', 'Dress Sundress Tiered Gingham — foto 1', 1, 1, '2026-09-15 08:01:00', '2026-09-15 08:01:00'),
(113, 38, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&h=1200&q=80', 'Dress Sundress Tiered Gingham — foto 2', 0, 2, '2026-09-15 08:01:00', '2026-09-15 08:01:00'),
(114, 38, 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?auto=format&fit=crop&w=900&h=1200&q=80', 'Dress Sundress Tiered Gingham — foto 3', 0, 3, '2026-09-15 08:01:00', '2026-09-15 08:01:00'),
(115, 39, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&h=900&q=80', 'Dress Kemeja Midi Khaki — foto 1', 1, 1, '2026-09-13 09:14:00', '2026-09-13 09:14:00'),
(116, 39, 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?auto=format&fit=crop&w=900&h=1200&q=80', 'Dress Kemeja Midi Khaki — foto 2', 0, 2, '2026-09-13 09:14:00', '2026-09-13 09:14:00'),
(117, 39, 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&h=1200&q=80', 'Dress Kemeja Midi Khaki — foto 3', 0, 3, '2026-09-13 09:14:00', '2026-09-13 09:14:00'),
(118, 40, 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?auto=format&fit=crop&w=900&h=900&q=80', 'Dress Off Shoulder Ruffle Terracotta — foto 1', 1, 1, '2026-09-11 10:27:00', '2026-09-11 10:27:00'),
(119, 40, 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&h=1200&q=80', 'Dress Off Shoulder Ruffle Terracotta — foto 2', 0, 2, '2026-09-11 10:27:00', '2026-09-11 10:27:00'),
(120, 40, 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&h=1200&q=80', 'Dress Off Shoulder Ruffle Terracotta — foto 3', 0, 3, '2026-09-11 10:27:00', '2026-09-11 10:27:00'),
(121, 41, 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&h=900&q=80', 'Blus Ruffle Satin Ivory — foto 1', 1, 1, '2026-09-09 01:40:00', '2026-09-09 01:40:00'),
(122, 41, 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&h=1200&q=80', 'Blus Ruffle Satin Ivory — foto 2', 0, 2, '2026-09-09 01:40:00', '2026-09-09 01:40:00'),
(123, 41, 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=900&h=1200&q=80', 'Blus Ruffle Satin Ivory — foto 3', 0, 3, '2026-09-09 01:40:00', '2026-09-09 01:40:00'),
(124, 42, 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&h=900&q=80', 'Blus Kerah Peter Pan Putih — foto 1', 1, 1, '2026-09-07 02:53:00', '2026-09-07 02:53:00'),
(125, 42, 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=900&h=1200&q=80', 'Blus Kerah Peter Pan Putih — foto 2', 0, 2, '2026-09-07 02:53:00', '2026-09-07 02:53:00'),
(126, 42, 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&h=1200&q=80', 'Blus Kerah Peter Pan Putih — foto 3', 0, 3, '2026-09-07 02:53:00', '2026-09-07 02:53:00'),
(127, 43, 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=900&h=900&q=80', 'Blus Oversized Poplin Navy — foto 1', 1, 1, '2026-09-05 03:06:00', '2026-09-05 03:06:00'),
(128, 43, 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&h=1200&q=80', 'Blus Oversized Poplin Navy — foto 2', 0, 2, '2026-09-05 03:06:00', '2026-09-05 03:06:00'),
(129, 43, 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&h=1200&q=80', 'Blus Oversized Poplin Navy — foto 3', 0, 3, '2026-09-05 03:06:00', '2026-09-05 03:06:00'),
(130, 44, 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&h=900&q=80', 'Blus Crop Boxy Cotton Pink — foto 1', 1, 1, '2026-09-03 04:19:00', '2026-09-03 04:19:00'),
(131, 44, 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&h=1200&q=80', 'Blus Crop Boxy Cotton Pink — foto 2', 0, 2, '2026-09-03 04:19:00', '2026-09-03 04:19:00'),
(132, 44, 'https://images.unsplash.com/photo-1496217590455-aa63a8350eea?auto=format&fit=crop&w=900&h=1200&q=80', 'Blus Crop Boxy Cotton Pink — foto 3', 0, 3, '2026-09-03 04:19:00', '2026-09-03 04:19:00'),
(133, 45, 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&h=900&q=80', 'Blus Tie Front Viscose Dusty Blue — foto 1', 1, 1, '2026-09-01 05:32:00', '2026-09-01 05:32:00'),
(134, 45, 'https://images.unsplash.com/photo-1496217590455-aa63a8350eea?auto=format&fit=crop&w=900&h=1200&q=80', 'Blus Tie Front Viscose Dusty Blue — foto 2', 0, 2, '2026-09-01 05:32:00', '2026-09-01 05:32:00'),
(135, 45, 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&h=1200&q=80', 'Blus Tie Front Viscose Dusty Blue — foto 3', 0, 3, '2026-09-01 05:32:00', '2026-09-01 05:32:00'),
(136, 46, 'https://images.unsplash.com/photo-1496217590455-aa63a8350eea?auto=format&fit=crop&w=900&h=900&q=80', 'Blus Batik Cap Sleeve Cokelat — foto 1', 1, 1, '2026-08-30 06:45:00', '2026-08-30 06:45:00'),
(137, 46, 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&h=1200&q=80', 'Blus Batik Cap Sleeve Cokelat — foto 2', 0, 2, '2026-08-30 06:45:00', '2026-08-30 06:45:00'),
(138, 46, 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&h=1200&q=80', 'Blus Batik Cap Sleeve Cokelat — foto 3', 0, 3, '2026-08-30 06:45:00', '2026-08-30 06:45:00'),
(139, 47, 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&h=900&q=80', 'Blus Knit Cropped Cream — foto 1', 1, 1, '2026-08-28 07:58:00', '2026-08-28 07:58:00'),
(140, 47, 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&h=1200&q=80', 'Blus Knit Cropped Cream — foto 2', 0, 2, '2026-08-28 07:58:00', '2026-08-28 07:58:00'),
(141, 47, 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=900&h=1200&q=80', 'Blus Knit Cropped Cream — foto 3', 0, 3, '2026-08-28 07:58:00', '2026-08-28 07:58:00'),
(142, 48, 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&h=900&q=80', 'Blus Peplum Formal Hitam — foto 1', 1, 1, '2026-08-26 08:11:00', '2026-08-26 08:11:00'),
(143, 48, 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=900&h=1200&q=80', 'Blus Peplum Formal Hitam — foto 2', 0, 2, '2026-08-26 08:11:00', '2026-08-26 08:11:00'),
(144, 48, 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&h=1200&q=80', 'Blus Peplum Formal Hitam — foto 3', 0, 3, '2026-08-26 08:11:00', '2026-08-26 08:11:00'),
(145, 49, 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&h=900&q=80', 'Rok Plisket Midi Hitam — foto 1', 1, 1, '2026-08-24 09:24:00', '2026-08-24 09:24:00'),
(146, 49, 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&h=1200&q=80', 'Rok Plisket Midi Hitam — foto 2', 0, 2, '2026-08-24 09:24:00', '2026-08-24 09:24:00'),
(147, 49, 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&h=1200&q=80', 'Rok Plisket Midi Hitam — foto 3', 0, 3, '2026-08-24 09:24:00', '2026-08-24 09:24:00'),
(148, 50, 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&h=900&q=80', 'Rok Denim A-Line Mid Blue — foto 1', 1, 1, '2026-08-22 10:37:00', '2026-08-22 10:37:00'),
(149, 50, 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&h=1200&q=80', 'Rok Denim A-Line Mid Blue — foto 2', 0, 2, '2026-08-22 10:37:00', '2026-08-22 10:37:00'),
(150, 50, 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&h=1200&q=80', 'Rok Denim A-Line Mid Blue — foto 3', 0, 3, '2026-08-22 10:37:00', '2026-08-22 10:37:00'),
(151, 51, 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&h=900&q=80', 'Rok Span Mini Kulot Hitam — foto 1', 1, 1, '2026-08-20 01:50:00', '2026-08-20 01:50:00'),
(152, 51, 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&h=1200&q=80', 'Rok Span Mini Kulot Hitam — foto 2', 0, 2, '2026-08-20 01:50:00', '2026-08-20 01:50:00'),
(153, 51, 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&h=1200&q=80', 'Rok Span Mini Kulot Hitam — foto 3', 0, 3, '2026-08-20 01:50:00', '2026-08-20 01:50:00'),
(154, 52, 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&h=900&q=80', 'Rok Linen Panjang Sage — foto 1', 1, 1, '2026-08-18 02:03:00', '2026-08-18 02:03:00'),
(155, 52, 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&h=1200&q=80', 'Rok Linen Panjang Sage — foto 2', 0, 2, '2026-08-18 02:03:00', '2026-08-18 02:03:00'),
(156, 52, 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&h=1200&q=80', 'Rok Linen Panjang Sage — foto 3', 0, 3, '2026-08-18 02:03:00', '2026-08-18 02:03:00'),
(157, 53, 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&h=900&q=80', 'Rok Batik Lilit Motif Kawung — foto 1', 1, 1, '2026-08-16 03:16:00', '2026-08-16 03:16:00'),
(158, 53, 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&h=1200&q=80', 'Rok Batik Lilit Motif Kawung — foto 2', 0, 2, '2026-08-16 03:16:00', '2026-08-16 03:16:00'),
(159, 53, 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&h=1200&q=80', 'Rok Batik Lilit Motif Kawung — foto 3', 0, 3, '2026-08-16 03:16:00', '2026-08-16 03:16:00'),
(160, 54, 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&h=900&q=80', 'Blazer Oversized Linen Oat — foto 1', 1, 1, '2026-08-14 04:29:00', '2026-08-14 04:29:00'),
(161, 54, 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&h=1200&q=80', 'Blazer Oversized Linen Oat — foto 2', 0, 2, '2026-08-14 04:29:00', '2026-08-14 04:29:00'),
(162, 54, 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=900&h=1200&q=80', 'Blazer Oversized Linen Oat — foto 3', 0, 3, '2026-08-14 04:29:00', '2026-08-14 04:29:00'),
(163, 55, 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&h=900&q=80', 'Cardigan Rajut Cropped Mocca — foto 1', 1, 1, '2026-08-12 05:42:00', '2026-08-12 05:42:00'),
(164, 55, 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=900&h=1200&q=80', 'Cardigan Rajut Cropped Mocca — foto 2', 0, 2, '2026-08-12 05:42:00', '2026-08-12 05:42:00'),
(165, 55, 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&h=1200&q=80', 'Cardigan Rajut Cropped Mocca — foto 3', 0, 3, '2026-08-12 05:42:00', '2026-08-12 05:42:00'),
(166, 56, 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=900&h=900&q=80', 'Trench Coat Katun Khaki — foto 1', 1, 1, '2026-08-10 06:55:00', '2026-08-10 06:55:00'),
(167, 56, 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&h=1200&q=80', 'Trench Coat Katun Khaki — foto 2', 0, 2, '2026-08-10 06:55:00', '2026-08-10 06:55:00'),
(168, 56, 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=900&h=1200&q=80', 'Trench Coat Katun Khaki — foto 3', 0, 3, '2026-08-10 06:55:00', '2026-08-10 06:55:00'),
(169, 57, 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&h=900&q=80', 'Bomber Satin Wanita Sage — foto 1', 1, 1, '2026-08-08 07:08:00', '2026-08-08 07:08:00'),
(170, 57, 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=900&h=1200&q=80', 'Bomber Satin Wanita Sage — foto 2', 0, 2, '2026-08-08 07:08:00', '2026-08-08 07:08:00'),
(171, 57, 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&h=1200&q=80', 'Bomber Satin Wanita Sage — foto 3', 0, 3, '2026-08-08 07:08:00', '2026-08-08 07:08:00'),
(172, 58, 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=900&h=900&q=80', 'Kimono Rayon Floral — foto 1', 1, 1, '2026-08-06 08:21:00', '2026-08-06 08:21:00'),
(173, 58, 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&h=1200&q=80', 'Kimono Rayon Floral — foto 2', 0, 2, '2026-08-06 08:21:00', '2026-08-06 08:21:00'),
(174, 58, 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&h=1200&q=80', 'Kimono Rayon Floral — foto 3', 0, 3, '2026-08-06 08:21:00', '2026-08-06 08:21:00'),
(175, 59, 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=900&h=900&q=80', 'Sneakers Canvas Low Putih — foto 1', 1, 1, '2026-08-04 09:34:00', '2026-08-04 09:34:00'),
(176, 59, 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=900&h=1200&q=80', 'Sneakers Canvas Low Putih — foto 2', 0, 2, '2026-08-04 09:34:00', '2026-08-04 09:34:00'),
(177, 59, 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&h=1200&q=80', 'Sneakers Canvas Low Putih — foto 3', 0, 3, '2026-08-04 09:34:00', '2026-08-04 09:34:00'),
(178, 60, 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=900&h=900&q=80', 'Sneakers Chunky Retro Silver — foto 1', 1, 1, '2026-08-02 10:47:00', '2026-08-02 10:47:00'),
(179, 60, 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&h=1200&q=80', 'Sneakers Chunky Retro Silver — foto 2', 0, 2, '2026-08-02 10:47:00', '2026-08-02 10:47:00'),
(180, 60, 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?auto=format&fit=crop&w=900&h=1200&q=80', 'Sneakers Chunky Retro Silver — foto 3', 0, 3, '2026-08-02 10:47:00', '2026-08-02 10:47:00'),
(181, 61, 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&h=900&q=80', 'Sepatu Kulit Formal Oxford Hitam — foto 1', 1, 1, '2026-07-31 01:00:00', '2026-07-31 01:00:00'),
(182, 61, 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?auto=format&fit=crop&w=900&h=1200&q=80', 'Sepatu Kulit Formal Oxford Hitam — foto 2', 0, 2, '2026-07-31 01:00:00', '2026-07-31 01:00:00'),
(183, 61, 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&h=1200&q=80', 'Sepatu Kulit Formal Oxford Hitam — foto 3', 0, 3, '2026-07-31 01:00:00', '2026-07-31 01:00:00'),
(184, 62, 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?auto=format&fit=crop&w=900&h=900&q=80', 'Loafers Kulit Sintetis Cokelat — foto 1', 1, 1, '2026-07-29 02:13:00', '2026-07-29 02:13:00'),
(185, 62, 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&h=1200&q=80', 'Loafers Kulit Sintetis Cokelat — foto 2', 0, 2, '2026-07-29 02:13:00', '2026-07-29 02:13:00'),
(186, 62, 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&h=1200&q=80', 'Loafers Kulit Sintetis Cokelat — foto 3', 0, 3, '2026-07-29 02:13:00', '2026-07-29 02:13:00'),
(187, 63, 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&h=900&q=80', 'Pantofel Kulit Asli Navy — foto 1', 1, 1, '2026-07-27 03:26:00', '2026-07-27 03:26:00'),
(188, 63, 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&h=1200&q=80', 'Pantofel Kulit Asli Navy — foto 2', 0, 2, '2026-07-27 03:26:00', '2026-07-27 03:26:00'),
(189, 63, 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=900&h=1200&q=80', 'Pantofel Kulit Asli Navy — foto 3', 0, 3, '2026-07-27 03:26:00', '2026-07-27 03:26:00'),
(190, 64, 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&h=900&q=80', 'Boots Chelsea Kulit Cokelat — foto 1', 1, 1, '2026-07-25 04:39:00', '2026-07-25 04:39:00'),
(191, 64, 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=900&h=1200&q=80', 'Boots Chelsea Kulit Cokelat — foto 2', 0, 2, '2026-07-25 04:39:00', '2026-07-25 04:39:00'),
(192, 64, 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=900&h=1200&q=80', 'Boots Chelsea Kulit Cokelat — foto 3', 0, 3, '2026-07-25 04:39:00', '2026-07-25 04:39:00'),
(193, 65, 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=900&h=900&q=80', 'Boots Hiking Waterproof Brown — foto 1', 1, 1, '2026-07-23 05:52:00', '2026-07-23 05:52:00'),
(194, 65, 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=900&h=1200&q=80', 'Boots Hiking Waterproof Brown — foto 2', 0, 2, '2026-07-23 05:52:00', '2026-07-23 05:52:00'),
(195, 65, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&h=1200&q=80', 'Boots Hiking Waterproof Brown — foto 3', 0, 3, '2026-07-23 05:52:00', '2026-07-23 05:52:00'),
(196, 66, 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=900&h=900&q=80', 'Sneakers Running Knit Abu — foto 1', 1, 1, '2026-07-21 06:05:00', '2026-07-21 06:05:00'),
(197, 66, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&h=1200&q=80', 'Sneakers Running Knit Abu — foto 2', 0, 2, '2026-07-21 06:05:00', '2026-07-21 06:05:00'),
(198, 66, 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&h=1200&q=80', 'Sneakers Running Knit Abu — foto 3', 0, 3, '2026-07-21 06:05:00', '2026-07-21 06:05:00'),
(199, 67, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&h=900&q=80', 'Wedges Kanvas Krem — foto 1', 1, 1, '2026-07-19 07:18:00', '2026-07-19 07:18:00'),
(200, 67, 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&h=1200&q=80', 'Wedges Kanvas Krem — foto 2', 0, 2, '2026-07-19 07:18:00', '2026-07-19 07:18:00'),
(201, 67, 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&h=1200&q=80', 'Wedges Kanvas Krem — foto 3', 0, 3, '2026-07-19 07:18:00', '2026-07-19 07:18:00'),
(202, 68, 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&h=900&q=80', 'Heels Blok Tali Hitam — foto 1', 1, 1, '2026-07-17 08:31:00', '2026-07-17 08:31:00'),
(203, 68, 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&h=1200&q=80', 'Heels Blok Tali Hitam — foto 2', 0, 2, '2026-07-17 08:31:00', '2026-07-17 08:31:00'),
(204, 68, 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=900&h=1200&q=80', 'Heels Blok Tali Hitam — foto 3', 0, 3, '2026-07-17 08:31:00', '2026-07-17 08:31:00'),
(205, 69, 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&h=900&q=80', 'Sneakers Slip-On Denim — foto 1', 1, 1, '2026-07-15 09:44:00', '2026-07-15 09:44:00'),
(206, 69, 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=900&h=1200&q=80', 'Sneakers Slip-On Denim — foto 2', 0, 2, '2026-07-15 09:44:00', '2026-07-15 09:44:00'),
(207, 69, 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&h=1200&q=80', 'Sneakers Slip-On Denim — foto 3', 0, 3, '2026-07-15 09:44:00', '2026-07-15 09:44:00'),
(208, 70, 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=900&h=900&q=80', 'Pantofel Wanita Nude — foto 1', 1, 1, '2026-07-13 10:57:00', '2026-07-13 10:57:00'),
(209, 70, 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&h=1200&q=80', 'Pantofel Wanita Nude — foto 2', 0, 2, '2026-07-13 10:57:00', '2026-07-13 10:57:00'),
(210, 70, 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=900&h=1200&q=80', 'Pantofel Wanita Nude — foto 3', 0, 3, '2026-07-13 10:57:00', '2026-07-13 10:57:00'),
(211, 71, 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=900&h=900&q=80', 'Sandal Slide Puffy Hitam — foto 1', 1, 1, '2026-07-11 01:10:00', '2026-07-11 01:10:00'),
(212, 71, 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&h=1200&q=80', 'Sandal Slide Puffy Hitam — foto 2', 0, 2, '2026-07-11 01:10:00', '2026-07-11 01:10:00'),
(213, 71, 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&h=1200&q=80', 'Sandal Slide Puffy Hitam — foto 3', 0, 3, '2026-07-11 01:10:00', '2026-07-11 01:10:00'),
(214, 72, 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&h=900&q=80', 'Sandal Kulit Tali Silang Cokelat — foto 1', 1, 1, '2026-07-09 02:23:00', '2026-07-09 02:23:00'),
(215, 72, 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&h=1200&q=80', 'Sandal Kulit Tali Silang Cokelat — foto 2', 0, 2, '2026-07-09 02:23:00', '2026-07-09 02:23:00'),
(216, 72, 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=900&h=1200&q=80', 'Sandal Kulit Tali Silang Cokelat — foto 3', 0, 3, '2026-07-09 02:23:00', '2026-07-09 02:23:00'),
(217, 73, 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&h=900&q=80', 'Sandal Sport Outdoor Abu — foto 1', 1, 1, '2026-07-07 03:36:00', '2026-07-07 03:36:00'),
(218, 73, 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=900&h=1200&q=80', 'Sandal Sport Outdoor Abu — foto 2', 0, 2, '2026-07-07 03:36:00', '2026-07-07 03:36:00'),
(219, 73, 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=900&h=1200&q=80', 'Sandal Sport Outdoor Abu — foto 3', 0, 3, '2026-07-07 03:36:00', '2026-07-07 03:36:00'),
(220, 74, 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=900&h=900&q=80', 'Sandal Heels Tali Mocca — foto 1', 1, 1, '2026-07-05 04:49:00', '2026-07-05 04:49:00'),
(221, 74, 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=900&h=1200&q=80', 'Sandal Heels Tali Mocca — foto 2', 0, 2, '2026-07-05 04:49:00', '2026-07-05 04:49:00'),
(222, 74, 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&h=1200&q=80', 'Sandal Heels Tali Mocca — foto 3', 0, 3, '2026-07-05 04:49:00', '2026-07-05 04:49:00'),
(223, 75, 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=900&h=900&q=80', 'Tas Ransel Kanvas Vintage Khaki — foto 1', 1, 1, '2026-07-03 05:02:00', '2026-07-03 05:02:00'),
(224, 75, 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=900&h=1200&q=80', 'Tas Ransel Kanvas Vintage Khaki — foto 2', 0, 2, '2026-07-03 05:02:00', '2026-07-03 05:02:00'),
(225, 75, 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=900&h=1200&q=80', 'Tas Ransel Kanvas Vintage Khaki — foto 3', 0, 3, '2026-07-03 05:02:00', '2026-07-03 05:02:00'),
(226, 76, 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=900&h=900&q=80', 'Ransel Laptop Water Repellent Hitam — foto 1', 1, 1, '2026-07-01 06:15:00', '2026-07-01 06:15:00'),
(227, 76, 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=900&h=1200&q=80', 'Ransel Laptop Water Repellent Hitam — foto 2', 0, 2, '2026-07-01 06:15:00', '2026-07-01 06:15:00'),
(228, 76, 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&h=1200&q=80', 'Ransel Laptop Water Repellent Hitam — foto 3', 0, 3, '2026-07-01 06:15:00', '2026-07-01 06:15:00'),
(229, 77, 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=900&h=900&q=80', 'Ransel Roll Top Army — foto 1', 1, 1, '2026-06-29 07:28:00', '2026-06-29 07:28:00'),
(230, 77, 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&h=1200&q=80', 'Ransel Roll Top Army — foto 2', 0, 2, '2026-06-29 07:28:00', '2026-06-29 07:28:00'),
(231, 77, 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=900&h=1200&q=80', 'Ransel Roll Top Army — foto 3', 0, 3, '2026-06-29 07:28:00', '2026-06-29 07:28:00'),
(232, 78, 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&h=900&q=80', 'Ransel Mini Nylon Cream — foto 1', 1, 1, '2026-06-27 08:41:00', '2026-06-27 08:41:00'),
(233, 78, 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=900&h=1200&q=80', 'Ransel Mini Nylon Cream — foto 2', 0, 2, '2026-06-27 08:41:00', '2026-06-27 08:41:00'),
(234, 78, 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=900&h=1200&q=80', 'Ransel Mini Nylon Cream — foto 3', 0, 3, '2026-06-27 08:41:00', '2026-06-27 08:41:00'),
(235, 79, 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=900&h=900&q=80', 'Ransel Kulit Cokelat — foto 1', 1, 1, '2026-06-25 09:54:00', '2026-06-25 09:54:00'),
(236, 79, 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=900&h=1200&q=80', 'Ransel Kulit Cokelat — foto 2', 0, 2, '2026-06-25 09:54:00', '2026-06-25 09:54:00'),
(237, 79, 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=900&h=1200&q=80', 'Ransel Kulit Cokelat — foto 3', 0, 3, '2026-06-25 09:54:00', '2026-06-25 09:54:00'),
(238, 80, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&h=900&q=80', 'Tas Selempang Kanvas Natural — foto 1', 1, 1, '2026-06-23 10:07:00', '2026-06-23 10:07:00'),
(239, 80, 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&h=1200&q=80', 'Tas Selempang Kanvas Natural — foto 2', 0, 2, '2026-06-23 10:07:00', '2026-06-23 10:07:00'),
(240, 80, 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=900&h=1200&q=80', 'Tas Selempang Kanvas Natural — foto 3', 0, 3, '2026-06-23 10:07:00', '2026-06-23 10:07:00'),
(241, 81, 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&h=900&q=80', 'Sling Cordura Hitam — foto 1', 1, 1, '2026-06-21 01:20:00', '2026-06-21 01:20:00'),
(242, 81, 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=900&h=1200&q=80', 'Sling Cordura Hitam — foto 2', 0, 2, '2026-06-21 01:20:00', '2026-06-21 01:20:00'),
(243, 81, 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=900&h=1200&q=80', 'Sling Cordura Hitam — foto 3', 0, 3, '2026-06-21 01:20:00', '2026-06-21 01:20:00'),
(244, 82, 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=900&h=900&q=80', 'Tas Selempang Kulit Cokelat — foto 1', 1, 1, '2026-06-19 02:33:00', '2026-06-19 02:33:00'),
(245, 82, 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=900&h=1200&q=80', 'Tas Selempang Kulit Cokelat — foto 2', 0, 2, '2026-06-19 02:33:00', '2026-06-19 02:33:00'),
(246, 82, 'https://images.unsplash.com/photo-1475180098004-ca77a66827be?auto=format&fit=crop&w=900&h=1200&q=80', 'Tas Selempang Kulit Cokelat — foto 3', 0, 3, '2026-06-19 02:33:00', '2026-06-19 02:33:00');
INSERT INTO `product_images` (`id`, `product_id`, `url`, `alt_text`, `is_primary`, `sort_order`, `created_at`, `updated_at`) VALUES
(247, 83, 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=900&h=900&q=80', 'Sling Ripstop Olive — foto 1', 1, 1, '2026-06-17 03:46:00', '2026-06-17 03:46:00'),
(248, 83, 'https://images.unsplash.com/photo-1475180098004-ca77a66827be?auto=format&fit=crop&w=900&h=1200&q=80', 'Sling Ripstop Olive — foto 2', 0, 2, '2026-06-17 03:46:00', '2026-06-17 03:46:00'),
(249, 83, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&h=1200&q=80', 'Sling Ripstop Olive — foto 3', 0, 3, '2026-06-17 03:46:00', '2026-06-17 03:46:00'),
(250, 84, 'https://images.unsplash.com/photo-1475180098004-ca77a66827be?auto=format&fit=crop&w=900&h=900&q=80', 'Selempang Mini Quilted Cream — foto 1', 1, 1, '2026-06-15 04:59:00', '2026-06-15 04:59:00'),
(251, 84, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&h=1200&q=80', 'Selempang Mini Quilted Cream — foto 2', 0, 2, '2026-06-15 04:59:00', '2026-06-15 04:59:00'),
(252, 84, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&h=1200&q=80', 'Selempang Mini Quilted Cream — foto 3', 0, 3, '2026-06-15 04:59:00', '2026-06-15 04:59:00'),
(253, 85, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&h=900&q=80', 'Messenger Kanvas Navy — foto 1', 1, 1, '2026-06-13 05:12:00', '2026-06-13 05:12:00'),
(254, 85, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&h=1200&q=80', 'Messenger Kanvas Navy — foto 2', 0, 2, '2026-06-13 05:12:00', '2026-06-13 05:12:00'),
(255, 85, 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&h=1200&q=80', 'Messenger Kanvas Navy — foto 3', 0, 3, '2026-06-13 05:12:00', '2026-06-13 05:12:00'),
(256, 86, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&h=900&q=80', 'Dompet Kulit Lipat Hitam — foto 1', 1, 1, '2026-06-11 06:25:00', '2026-06-11 06:25:00'),
(257, 86, 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&h=1200&q=80', 'Dompet Kulit Lipat Hitam — foto 2', 0, 2, '2026-06-11 06:25:00', '2026-06-11 06:25:00'),
(258, 86, 'https://images.unsplash.com/photo-1475180098004-ca77a66827be?auto=format&fit=crop&w=900&h=1200&q=80', 'Dompet Kulit Lipat Hitam — foto 3', 0, 3, '2026-06-11 06:25:00', '2026-06-11 06:25:00'),
(259, 87, 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&h=900&q=80', 'Dompet Kulit Panjang Cokelat — foto 1', 1, 1, '2026-06-09 07:38:00', '2026-06-09 07:38:00'),
(260, 87, 'https://images.unsplash.com/photo-1475180098004-ca77a66827be?auto=format&fit=crop&w=900&h=1200&q=80', 'Dompet Kulit Panjang Cokelat — foto 2', 0, 2, '2026-06-09 07:38:00', '2026-06-09 07:38:00'),
(261, 87, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&h=1200&q=80', 'Dompet Kulit Panjang Cokelat — foto 3', 0, 3, '2026-06-09 07:38:00', '2026-06-09 07:38:00'),
(262, 88, 'https://images.unsplash.com/photo-1475180098004-ca77a66827be?auto=format&fit=crop&w=900&h=900&q=80', 'Dompet Kartu Slim Navy — foto 1', 1, 1, '2026-06-07 08:51:00', '2026-06-07 08:51:00'),
(263, 88, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&h=1200&q=80', 'Dompet Kartu Slim Navy — foto 2', 0, 2, '2026-06-07 08:51:00', '2026-06-07 08:51:00'),
(264, 88, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&h=1200&q=80', 'Dompet Kartu Slim Navy — foto 3', 0, 3, '2026-06-07 08:51:00', '2026-06-07 08:51:00'),
(265, 89, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&h=900&q=80', 'Dompet Kanvas Olive — foto 1', 1, 1, '2026-06-05 09:04:00', '2026-06-05 09:04:00'),
(266, 89, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&h=1200&q=80', 'Dompet Kanvas Olive — foto 2', 0, 2, '2026-06-05 09:04:00', '2026-06-05 09:04:00'),
(267, 89, 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&h=1200&q=80', 'Dompet Kanvas Olive — foto 3', 0, 3, '2026-06-05 09:04:00', '2026-06-05 09:04:00'),
(268, 90, 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&h=900&q=80', 'Jam Tangan Minimalis Dial Putih — foto 1', 1, 1, '2026-06-03 10:17:00', '2026-06-03 10:17:00'),
(269, 90, 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=900&h=1200&q=80', 'Jam Tangan Minimalis Dial Putih — foto 2', 0, 2, '2026-06-03 10:17:00', '2026-06-03 10:17:00'),
(270, 90, 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&h=1200&q=80', 'Jam Tangan Minimalis Dial Putih — foto 3', 0, 3, '2026-06-03 10:17:00', '2026-06-03 10:17:00'),
(271, 91, 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=900&h=900&q=80', 'Jam Tangan Kulit Cokelat 38mm — foto 1', 1, 1, '2026-06-01 01:30:00', '2026-06-01 01:30:00'),
(272, 91, 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&h=1200&q=80', 'Jam Tangan Kulit Cokelat 38mm — foto 2', 0, 2, '2026-06-01 01:30:00', '2026-06-01 01:30:00'),
(273, 91, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&h=1200&q=80', 'Jam Tangan Kulit Cokelat 38mm — foto 3', 0, 3, '2026-06-01 01:30:00', '2026-06-01 01:30:00'),
(274, 92, 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&h=900&q=80', 'Jam Tangan Digital Sport Hitam — foto 1', 1, 1, '2026-05-30 02:43:00', '2026-05-30 02:43:00'),
(275, 92, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&h=1200&q=80', 'Jam Tangan Digital Sport Hitam — foto 2', 0, 2, '2026-05-30 02:43:00', '2026-05-30 02:43:00'),
(276, 92, 'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=900&h=1200&q=80', 'Jam Tangan Digital Sport Hitam — foto 3', 0, 3, '2026-05-30 02:43:00', '2026-05-30 02:43:00'),
(277, 93, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&h=900&q=80', 'Jam Tangan Mesh Steel Silver — foto 1', 1, 1, '2026-05-28 03:56:00', '2026-05-28 03:56:00'),
(278, 93, 'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=900&h=1200&q=80', 'Jam Tangan Mesh Steel Silver — foto 2', 0, 2, '2026-05-28 03:56:00', '2026-05-28 03:56:00'),
(279, 93, 'https://images.unsplash.com/photo-1622445275576-721325763afe?auto=format&fit=crop&w=900&h=1200&q=80', 'Jam Tangan Mesh Steel Silver — foto 3', 0, 3, '2026-05-28 03:56:00', '2026-05-28 03:56:00'),
(280, 94, 'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=900&h=900&q=80', 'Jam Tangan Couple Set Rose Gold — foto 1', 1, 1, '2026-05-26 04:09:00', '2026-05-26 04:09:00'),
(281, 94, 'https://images.unsplash.com/photo-1622445275576-721325763afe?auto=format&fit=crop&w=900&h=1200&q=80', 'Jam Tangan Couple Set Rose Gold — foto 2', 0, 2, '2026-05-26 04:09:00', '2026-05-26 04:09:00'),
(282, 94, 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&h=1200&q=80', 'Jam Tangan Couple Set Rose Gold — foto 3', 0, 3, '2026-05-26 04:09:00', '2026-05-26 04:09:00'),
(283, 95, 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&h=900&q=80', 'Kacamata Wayfarer Hitam — foto 1', 1, 1, '2026-05-24 05:22:00', '2026-05-24 05:22:00'),
(284, 95, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&h=1200&q=80', 'Kacamata Wayfarer Hitam — foto 2', 0, 2, '2026-05-24 05:22:00', '2026-05-24 05:22:00'),
(285, 95, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=900&h=1200&q=80', 'Kacamata Wayfarer Hitam — foto 3', 0, 3, '2026-05-24 05:22:00', '2026-05-24 05:22:00'),
(286, 96, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&h=900&q=80', 'Kacamata Bulat Frame Emas — foto 1', 1, 1, '2026-05-22 06:35:00', '2026-05-22 06:35:00'),
(287, 96, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=900&h=1200&q=80', 'Kacamata Bulat Frame Emas — foto 2', 0, 2, '2026-05-22 06:35:00', '2026-05-22 06:35:00'),
(288, 96, 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=900&h=1200&q=80', 'Kacamata Bulat Frame Emas — foto 3', 0, 3, '2026-05-22 06:35:00', '2026-05-22 06:35:00'),
(289, 97, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=900&h=900&q=80', 'Kacamata Cat Eye Tortoise — foto 1', 1, 1, '2026-05-20 07:48:00', '2026-05-20 07:48:00'),
(290, 97, 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=900&h=1200&q=80', 'Kacamata Cat Eye Tortoise — foto 2', 0, 2, '2026-05-20 07:48:00', '2026-05-20 07:48:00'),
(291, 97, 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&h=1200&q=80', 'Kacamata Cat Eye Tortoise — foto 3', 0, 3, '2026-05-20 07:48:00', '2026-05-20 07:48:00'),
(292, 98, 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=900&h=900&q=80', 'Kalung Rantai Stainless Gold — foto 1', 1, 1, '2026-05-18 08:01:00', '2026-05-18 08:01:00'),
(293, 98, 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&h=1200&q=80', 'Kalung Rantai Stainless Gold — foto 2', 0, 2, '2026-05-18 08:01:00', '2026-05-18 08:01:00'),
(294, 98, 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&h=1200&q=80', 'Kalung Rantai Stainless Gold — foto 3', 0, 3, '2026-05-18 08:01:00', '2026-05-18 08:01:00'),
(295, 99, 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&h=900&q=80', 'Gelang Beads Natural Stone — foto 1', 1, 1, '2026-05-16 09:14:00', '2026-05-16 09:14:00'),
(296, 99, 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&h=1200&q=80', 'Gelang Beads Natural Stone — foto 2', 0, 2, '2026-05-16 09:14:00', '2026-05-16 09:14:00'),
(297, 99, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&h=1200&q=80', 'Gelang Beads Natural Stone — foto 3', 0, 3, '2026-05-16 09:14:00', '2026-05-16 09:14:00'),
(298, 100, 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&h=900&q=80', 'Anting Hoop Stainless Silver — foto 1', 1, 1, '2026-05-14 10:27:00', '2026-05-14 10:27:00'),
(299, 100, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&h=1200&q=80', 'Anting Hoop Stainless Silver — foto 2', 0, 2, '2026-05-14 10:27:00', '2026-05-14 10:27:00'),
(300, 100, 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=900&h=1200&q=80', 'Anting Hoop Stainless Silver — foto 3', 0, 3, '2026-05-14 10:27:00', '2026-05-14 10:27:00');

-- --------------------------------------------------------

--
-- Table structure for table `product_materials`
--

CREATE TABLE `product_materials` (
  `id` bigint UNSIGNED NOT NULL,
  `product_id` bigint UNSIGNED NOT NULL,
  `raw_material_id` bigint UNSIGNED NOT NULL,
  `quantity` decimal(18,4) NOT NULL,
  `unit_cost` decimal(18,4) NOT NULL DEFAULT '0.0000',
  `total_cost` decimal(18,4) NOT NULL DEFAULT '0.0000',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_materials`
--

INSERT INTO `product_materials` (`id`, `product_id`, `raw_material_id`, `quantity`, `unit_cost`, `total_cost`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 0.1800, 96500.0000, 17370.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(2, 1, 6, 0.1400, 78000.0000, 10920.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(3, 2, 2, 0.2500, 104000.0000, 26000.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(4, 2, 9, 0.0900, 187000.0000, 16830.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(5, 3, 3, 0.3200, 118500.0000, 37920.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(6, 3, 12, 3.5600, 6500.0000, 23140.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(7, 4, 4, 0.3800, 68500.0000, 26030.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(8, 4, 1, 0.1600, 96500.0000, 15440.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(9, 5, 5, 0.2200, 92000.0000, 20240.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(10, 5, 4, 0.1800, 68500.0000, 12330.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(11, 6, 6, 0.5000, 78000.0000, 39000.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(12, 6, 7, 0.5700, 42000.0000, 23940.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(13, 7, 7, 1.0600, 42000.0000, 44520.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(14, 7, 10, 2.1800, 12500.0000, 27250.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(15, 8, 8, 0.2100, 135000.0000, 28350.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(16, 8, 13, 20.7500, 850.0000, 17637.5000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(17, 9, 9, 0.2600, 187000.0000, 48620.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(18, 9, 2, 0.2900, 104000.0000, 30160.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(19, 10, 10, 1.6100, 12500.0000, 20125.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(20, 10, 5, 0.1300, 92000.0000, 11960.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(21, 11, 11, 1.8200, 27000.0000, 49140.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(22, 11, 8, 0.2200, 135000.0000, 29700.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(23, 12, 12, 10.6200, 6500.0000, 69030.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(24, 12, 11, 1.5700, 27000.0000, 42390.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(25, 13, 13, 67.4600, 850.0000, 57341.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(26, 13, 14, 8.3700, 4200.0000, 35154.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(27, 14, 14, 12.1300, 4200.0000, 50946.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(28, 14, 3, 0.2600, 118500.0000, 30810.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(29, 15, 1, 0.7600, 96500.0000, 73340.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(30, 15, 6, 0.5800, 78000.0000, 45240.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(31, 16, 2, 0.5800, 104000.0000, 60320.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(32, 16, 9, 0.2000, 187000.0000, 37400.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(33, 17, 3, 0.4100, 118500.0000, 48585.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(34, 17, 12, 4.6100, 6500.0000, 29965.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(35, 18, 4, 0.8300, 68500.0000, 56855.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(36, 18, 1, 0.3600, 96500.0000, 34740.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(37, 19, 5, 0.8400, 92000.0000, 77280.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(38, 19, 4, 0.6900, 68500.0000, 47265.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(39, 20, 6, 1.7000, 78000.0000, 132600.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(40, 20, 7, 1.9400, 42000.0000, 81480.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(41, 21, 7, 2.7100, 42000.0000, 113820.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(42, 21, 10, 5.5800, 12500.0000, 69750.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(43, 22, 8, 0.9400, 135000.0000, 126900.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(44, 22, 13, 91.4600, 850.0000, 77741.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(45, 23, 9, 0.6000, 187000.0000, 112200.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(46, 23, 2, 0.6600, 104000.0000, 68640.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(47, 24, 10, 6.8000, 12500.0000, 85000.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(48, 24, 5, 0.5700, 92000.0000, 52440.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(49, 25, 11, 1.4600, 27000.0000, 39420.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(50, 25, 8, 0.1800, 135000.0000, 24300.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(51, 26, 12, 10.3600, 6500.0000, 67340.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(52, 26, 11, 1.5300, 27000.0000, 41310.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(53, 27, 13, 74.1500, 850.0000, 63027.5000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(54, 27, 14, 9.2000, 4200.0000, 38640.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(55, 28, 14, 23.7200, 4200.0000, 99624.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(56, 28, 3, 0.5200, 118500.0000, 61620.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(57, 29, 1, 0.4600, 96500.0000, 44390.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(58, 29, 6, 0.3500, 78000.0000, 27300.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(59, 30, 2, 0.6200, 104000.0000, 64480.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(60, 30, 9, 0.2100, 187000.0000, 39270.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(61, 31, 3, 0.5700, 118500.0000, 67545.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(62, 31, 12, 6.4200, 6500.0000, 41730.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(63, 32, 4, 0.9800, 68500.0000, 67130.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(64, 32, 1, 0.4300, 96500.0000, 41495.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(65, 33, 5, 0.7800, 92000.0000, 71760.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(66, 33, 4, 0.6400, 68500.0000, 43840.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(67, 34, 6, 0.9700, 78000.0000, 75660.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(68, 34, 7, 1.1100, 42000.0000, 46620.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(69, 35, 7, 2.1600, 42000.0000, 90720.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(70, 35, 10, 4.4600, 12500.0000, 55750.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(71, 36, 8, 0.7100, 135000.0000, 95850.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(72, 36, 13, 69.0100, 850.0000, 58658.5000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(73, 37, 9, 0.2700, 187000.0000, 50490.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(74, 37, 2, 0.3000, 104000.0000, 31200.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(75, 38, 10, 3.2600, 12500.0000, 40750.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(76, 38, 5, 0.2700, 92000.0000, 24840.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(77, 39, 11, 2.4900, 27000.0000, 67230.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(78, 39, 8, 0.3100, 135000.0000, 41850.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(79, 40, 12, 8.6500, 6500.0000, 56225.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(80, 40, 11, 1.2800, 27000.0000, 34560.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(81, 41, 13, 54.8800, 850.0000, 46648.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(82, 41, 14, 6.8100, 4200.0000, 28602.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(83, 42, 14, 11.9600, 4200.0000, 50232.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(84, 42, 3, 0.2600, 118500.0000, 30810.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(85, 43, 1, 0.5600, 96500.0000, 54040.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(86, 43, 6, 0.4200, 78000.0000, 32760.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(87, 44, 2, 0.3200, 104000.0000, 33280.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(88, 44, 9, 0.1100, 187000.0000, 20570.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(89, 45, 3, 0.4400, 118500.0000, 52140.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(90, 45, 12, 4.8900, 6500.0000, 31785.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(91, 46, 4, 0.8900, 68500.0000, 60965.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(92, 46, 1, 0.3900, 96500.0000, 37635.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(93, 47, 5, 0.5300, 92000.0000, 48760.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(94, 47, 4, 0.4400, 68500.0000, 30140.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(95, 48, 6, 0.9200, 78000.0000, 71760.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(96, 48, 7, 1.0500, 42000.0000, 44100.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(97, 49, 7, 0.8900, 42000.0000, 37380.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(98, 49, 10, 1.8400, 12500.0000, 23000.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(99, 50, 8, 0.4100, 135000.0000, 55350.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(100, 50, 13, 39.6900, 850.0000, 33736.5000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(101, 51, 9, 0.2200, 187000.0000, 41140.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(102, 51, 2, 0.2500, 104000.0000, 26000.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(103, 52, 10, 4.1500, 12500.0000, 51875.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(104, 52, 5, 0.3500, 92000.0000, 32200.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(105, 53, 11, 2.1400, 27000.0000, 57780.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(106, 53, 8, 0.2600, 135000.0000, 35100.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(107, 54, 12, 12.6700, 6500.0000, 82355.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(108, 54, 11, 1.8700, 27000.0000, 50490.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(109, 55, 13, 82.8800, 850.0000, 70448.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(110, 55, 14, 10.2800, 4200.0000, 43176.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(111, 56, 14, 31.6100, 4200.0000, 132762.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(112, 56, 3, 0.6900, 118500.0000, 81765.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(113, 57, 1, 0.9700, 96500.0000, 93605.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(114, 57, 6, 0.7400, 78000.0000, 57720.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(115, 58, 2, 0.6800, 104000.0000, 70720.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(116, 58, 9, 0.2300, 187000.0000, 43010.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(117, 59, 3, 0.5500, 118500.0000, 65175.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(118, 59, 12, 6.1100, 6500.0000, 39715.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(119, 60, 4, 1.7500, 68500.0000, 119875.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(120, 60, 1, 0.7600, 96500.0000, 73340.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(121, 61, 5, 1.4000, 92000.0000, 128800.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(122, 61, 4, 1.1500, 68500.0000, 78775.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(123, 62, 6, 0.9900, 78000.0000, 77220.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(124, 62, 7, 1.1300, 42000.0000, 47460.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(125, 63, 7, 3.2600, 42000.0000, 136920.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(126, 63, 10, 6.7100, 12500.0000, 83875.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(127, 64, 8, 0.8000, 135000.0000, 108000.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(128, 64, 13, 78.0800, 850.0000, 66368.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(129, 65, 9, 1.0700, 187000.0000, 200090.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(130, 65, 2, 1.1800, 104000.0000, 122720.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(131, 66, 10, 8.4200, 12500.0000, 105250.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(132, 66, 5, 0.7000, 92000.0000, 64400.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(133, 67, 11, 3.1300, 27000.0000, 84510.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(134, 67, 8, 0.3800, 135000.0000, 51300.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(135, 68, 12, 12.2400, 6500.0000, 79560.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(136, 68, 11, 1.8100, 27000.0000, 48870.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(137, 69, 13, 95.9900, 850.0000, 81591.5000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(138, 69, 14, 11.9100, 4200.0000, 50022.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(139, 70, 14, 18.1000, 4200.0000, 76020.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(140, 70, 3, 0.3900, 118500.0000, 46215.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(141, 71, 1, 0.3200, 96500.0000, 30880.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(142, 71, 6, 0.2400, 78000.0000, 18720.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(143, 72, 2, 0.7200, 104000.0000, 74880.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(144, 72, 9, 0.2400, 187000.0000, 44880.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(145, 73, 3, 0.4200, 118500.0000, 49770.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(146, 73, 12, 4.6600, 6500.0000, 30290.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(147, 74, 4, 0.9800, 68500.0000, 67130.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(148, 74, 1, 0.4300, 96500.0000, 41495.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(149, 75, 5, 0.6900, 92000.0000, 63480.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(150, 75, 4, 0.5600, 68500.0000, 38360.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(151, 76, 6, 1.1900, 78000.0000, 92820.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(152, 76, 7, 1.3600, 42000.0000, 57120.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(153, 77, 7, 2.2800, 42000.0000, 95760.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(154, 77, 10, 4.6900, 12500.0000, 58625.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(155, 78, 8, 0.4200, 135000.0000, 56700.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(156, 78, 13, 41.1900, 850.0000, 35011.5000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(157, 79, 9, 0.6900, 187000.0000, 129030.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(158, 79, 2, 0.7600, 104000.0000, 79040.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(159, 80, 10, 3.2700, 12500.0000, 40875.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(160, 80, 5, 0.2700, 92000.0000, 24840.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(161, 81, 11, 2.4700, 27000.0000, 66690.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(162, 81, 8, 0.3000, 135000.0000, 40500.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(163, 82, 12, 14.8200, 6500.0000, 96330.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(164, 82, 11, 2.1900, 27000.0000, 59130.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(165, 83, 13, 73.2200, 850.0000, 62237.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(166, 83, 14, 9.0800, 4200.0000, 38136.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(167, 84, 14, 12.0000, 4200.0000, 50400.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(168, 84, 3, 0.2600, 118500.0000, 30810.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(169, 85, 1, 0.6400, 96500.0000, 61760.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(170, 85, 6, 0.4800, 78000.0000, 37440.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(171, 86, 2, 0.3300, 104000.0000, 34320.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(172, 86, 9, 0.1100, 187000.0000, 20570.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(173, 87, 3, 0.5000, 118500.0000, 59250.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(174, 87, 12, 5.5500, 6500.0000, 36075.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(175, 88, 4, 0.3800, 68500.0000, 26030.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(176, 88, 1, 0.1600, 96500.0000, 15440.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(177, 89, 5, 0.3100, 92000.0000, 28520.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(178, 89, 4, 0.2600, 68500.0000, 17810.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(179, 90, 6, 1.0600, 78000.0000, 82680.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(180, 90, 7, 1.2000, 42000.0000, 50400.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(181, 91, 7, 2.7400, 42000.0000, 115080.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(182, 91, 10, 5.6500, 12500.0000, 70625.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(183, 92, 8, 0.5400, 135000.0000, 72900.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(184, 92, 13, 52.1300, 850.0000, 44310.5000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(185, 93, 9, 0.7000, 187000.0000, 130900.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(186, 93, 2, 0.7700, 104000.0000, 80080.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(187, 94, 10, 12.1800, 12500.0000, 152250.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(188, 94, 5, 1.0100, 92000.0000, 92920.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(189, 95, 11, 2.2100, 27000.0000, 59670.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(190, 95, 8, 0.2700, 135000.0000, 36450.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(191, 96, 12, 13.4900, 6500.0000, 87685.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(192, 96, 11, 1.9900, 27000.0000, 53730.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(193, 97, 13, 58.1200, 850.0000, 49402.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(194, 97, 14, 7.2100, 4200.0000, 30282.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(195, 98, 14, 7.2600, 4200.0000, 30492.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(196, 98, 3, 0.1600, 118500.0000, 18960.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(197, 99, 1, 0.2800, 96500.0000, 27020.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(198, 99, 6, 0.2100, 78000.0000, 16380.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(199, 100, 2, 0.1600, 104000.0000, 16640.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37'),
(200, 100, 9, 0.0600, 187000.0000, 11220.0000, '2026-11-14 02:24:37', '2026-11-14 02:24:37');

-- --------------------------------------------------------

--
-- Table structure for table `product_reviews`
--

CREATE TABLE `product_reviews` (
  `id` bigint UNSIGNED NOT NULL,
  `product_id` bigint UNSIGNED NOT NULL,
  `order_id` bigint UNSIGNED NOT NULL,
  `order_item_id` bigint UNSIGNED NOT NULL,
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` tinyint UNSIGNED NOT NULL,
  `review` text COLLATE utf8mb4_unicode_ci,
  `media` json DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_by` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_reviews`
--

INSERT INTO `product_reviews` (`id`, `product_id`, `order_id`, `order_item_id`, `user_id`, `rating`, `review`, `media`, `is_active`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 15, 53, 104, '4937a1c4-62c8-5d35-3433-527614265df0', 4, 'Bahannya sesuai deskripsi, adem dipakai seharian. Jahitan rapi, packing juga aman pakai bubble wrap.', NULL, 1, '4937a1c4-62c8-5d35-3433-527614265df0', '4937a1c4-62c8-5d35-3433-527614265df0', '2026-11-13 21:36:02', '2026-11-13 21:36:02', NULL),
(2, 27, 53, 105, '4937a1c4-62c8-5d35-3433-527614265df0', 4, 'Kualitas di atas harga. Sudah dicuci dua kali belum melar dan warnanya belum pudar.', NULL, 1, '4937a1c4-62c8-5d35-3433-527614265df0', '4937a1c4-62c8-5d35-3433-527614265df0', '2026-11-13 21:36:02', '2026-11-13 21:36:02', NULL),
(3, 28, 57, 112, '5e73f21e-65ff-583e-b0b2-49790262bd99', 4, 'Sudah dua kali belanja di toko ini, konsisten kualitasnya. Pengemasan selalu aman.', NULL, 1, '5e73f21e-65ff-583e-b0b2-49790262bd99', '5e73f21e-65ff-583e-b0b2-49790262bd99', '2026-11-13 14:59:02', '2026-11-13 14:59:02', NULL),
(4, 42, 57, 113, '5e73f21e-65ff-583e-b0b2-49790262bd99', 4, 'Suka banget sama potongannya, jatuhnya rapi di badan. Akan repeat order warna lain.', NULL, 1, '5e73f21e-65ff-583e-b0b2-49790262bd99', '5e73f21e-65ff-583e-b0b2-49790262bd99', '2026-11-13 14:59:02', '2026-11-13 14:59:02', NULL),
(5, 54, 57, 114, '5e73f21e-65ff-583e-b0b2-49790262bd99', 4, 'Sesuai ekspektasi, kemasan rapi dan ada kartu ucapan terima kasih dari toko. Nice touch.', NULL, 1, '5e73f21e-65ff-583e-b0b2-49790262bd99', '5e73f21e-65ff-583e-b0b2-49790262bd99', '2026-11-13 14:59:02', '2026-11-13 14:59:02', NULL),
(6, 57, 65, 128, '36333497-c72b-06cc-4875-815d9af60356', 4, 'Modelnya lebih bagus aslinya dibanding foto. Bahan tidak panas, nyaman untuk cuaca di sini.', NULL, 1, '36333497-c72b-06cc-4875-815d9af60356', '36333497-c72b-06cc-4875-815d9af60356', '2026-11-13 01:44:02', '2026-11-13 01:44:02', NULL),
(7, 68, 65, 129, '36333497-c72b-06cc-4875-815d9af60356', 4, 'Bahannya sesuai deskripsi, adem dipakai seharian. Jahitan rapi, packing juga aman pakai bubble wrap.', NULL, 1, '36333497-c72b-06cc-4875-815d9af60356', '36333497-c72b-06cc-4875-815d9af60356', '2026-11-13 01:44:02', '2026-11-13 01:44:02', NULL),
(8, 66, 68, 134, '3dbd1354-8f7a-40b0-6247-23fcd4c8f491', 5, 'Pesan warna hitam, ternyata sedikit lebih gelap dari foto tapi justru lebih elegan. Recommended.', NULL, 1, '3dbd1354-8f7a-40b0-6247-23fcd4c8f491', '3dbd1354-8f7a-40b0-6247-23fcd4c8f491', '2026-11-12 20:47:02', '2026-11-12 20:47:02', NULL),
(9, 82, 68, 135, '3dbd1354-8f7a-40b0-6247-23fcd4c8f491', 5, 'Kualitas di atas harga. Sudah dicuci dua kali belum melar dan warnanya belum pudar.', NULL, 1, '3dbd1354-8f7a-40b0-6247-23fcd4c8f491', '3dbd1354-8f7a-40b0-6247-23fcd4c8f491', '2026-11-12 20:47:02', '2026-11-12 20:47:02', NULL),
(10, 69, 69, 136, '8c0d42e6-e169-f777-614c-4c86da4b386d', 4, 'Modelnya lebih bagus aslinya dibanding foto. Bahan tidak panas, nyaman untuk cuaca di sini.', NULL, 1, '8c0d42e6-e169-f777-614c-4c86da4b386d', '8c0d42e6-e169-f777-614c-4c86da4b386d', '2026-11-12 19:07:02', '2026-11-12 19:07:02', NULL),
(11, 96, 69, 137, '8c0d42e6-e169-f777-614c-4c86da4b386d', 4, 'Kualitas di atas harga. Sudah dicuci dua kali belum melar dan warnanya belum pudar.', NULL, 1, '8c0d42e6-e169-f777-614c-4c86da4b386d', '8c0d42e6-e169-f777-614c-4c86da4b386d', '2026-11-12 19:07:02', '2026-11-12 19:07:02', NULL),
(12, 12, 69, 138, '8c0d42e6-e169-f777-614c-4c86da4b386d', 4, 'Sesuai ekspektasi, kemasan rapi dan ada kartu ucapan terima kasih dari toko. Nice touch.', NULL, 1, '8c0d42e6-e169-f777-614c-4c86da4b386d', '8c0d42e6-e169-f777-614c-4c86da4b386d', '2026-11-12 19:07:02', '2026-11-12 19:07:02', NULL),
(13, 73, 71, 140, 'd741cf38-85e7-6fdc-bfb4-e9f01fa0ac4a', 5, 'Harga masuk akal untuk kualitas seperti ini. Jahitan di bagian bawah kuat, tidak mudah lepas.', NULL, 1, 'd741cf38-85e7-6fdc-bfb4-e9f01fa0ac4a', 'd741cf38-85e7-6fdc-bfb4-e9f01fa0ac4a', '2026-11-12 15:49:02', '2026-11-12 15:49:02', NULL),
(14, 13, 71, 141, 'd741cf38-85e7-6fdc-bfb4-e9f01fa0ac4a', 5, 'Sudah dua kali belanja di toko ini, konsisten kualitasnya. Pengemasan selalu aman.', NULL, 1, 'd741cf38-85e7-6fdc-bfb4-e9f01fa0ac4a', 'd741cf38-85e7-6fdc-bfb4-e9f01fa0ac4a', '2026-11-12 15:49:02', '2026-11-12 15:49:02', NULL),
(15, 88, 72, 142, '53c58789-9a09-c2a9-e0cd-c840a7530ddb', 5, 'Cepat sampai, barang original, dan seller fast response saat tanya stok. Terima kasih.', NULL, 1, '53c58789-9a09-c2a9-e0cd-c840a7530ddb', '53c58789-9a09-c2a9-e0cd-c840a7530ddb', '2026-11-12 14:09:02', '2026-11-12 14:09:02', NULL),
(16, 13, 72, 143, '53c58789-9a09-c2a9-e0cd-c840a7530ddb', 5, 'Cepat sampai, barang original, dan seller fast response saat tanya stok. Terima kasih.', NULL, 1, '53c58789-9a09-c2a9-e0cd-c840a7530ddb', '53c58789-9a09-c2a9-e0cd-c840a7530ddb', '2026-11-12 14:09:02', '2026-11-12 14:09:02', NULL),
(17, 23, 72, 144, '53c58789-9a09-c2a9-e0cd-c840a7530ddb', 5, 'Produk bagus, tapi pengiriman agak lama sampai. Pelayanan chat seller ramah dan cepat balas.', NULL, 1, '53c58789-9a09-c2a9-e0cd-c840a7530ddb', '53c58789-9a09-c2a9-e0cd-c840a7530ddb', '2026-11-12 14:09:02', '2026-11-12 14:09:02', NULL),
(18, 13, 74, 146, '8422156d-3226-4379-1db3-86d8a6f18a5e', 5, 'Bahan adem dan tidak kaku, dipakai ke kantor tetap nyaman. Size chart-nya akurat.', NULL, 1, '8422156d-3226-4379-1db3-86d8a6f18a5e', '8422156d-3226-4379-1db3-86d8a6f18a5e', '2026-11-12 10:51:02', '2026-11-12 10:51:02', NULL),
(19, 17, 74, 147, '8422156d-3226-4379-1db3-86d8a6f18a5e', 5, 'Bahan adem dan tidak kaku, dipakai ke kantor tetap nyaman. Size chart-nya akurat.', NULL, 1, '8422156d-3226-4379-1db3-86d8a6f18a5e', '8422156d-3226-4379-1db3-86d8a6f18a5e', '2026-11-12 10:51:02', '2026-11-12 10:51:02', NULL),
(20, 13, 75, 148, 'd6279585-7e9d-a7d9-50b8-d20071ff20d5', 5, 'Bahannya sesuai deskripsi, adem dipakai seharian. Jahitan rapi, packing juga aman pakai bubble wrap.', NULL, 1, 'd6279585-7e9d-a7d9-50b8-d20071ff20d5', 'd6279585-7e9d-a7d9-50b8-d20071ff20d5', '2026-11-12 09:11:02', '2026-11-12 09:11:02', NULL),
(21, 21, 75, 149, 'd6279585-7e9d-a7d9-50b8-d20071ff20d5', 5, 'Bagus untuk harga segini, tapi ada benang lepas sedikit di bagian manset. Selebihnya oke.', NULL, 1, 'd6279585-7e9d-a7d9-50b8-d20071ff20d5', 'd6279585-7e9d-a7d9-50b8-d20071ff20d5', '2026-11-12 09:11:02', '2026-11-12 09:11:02', NULL),
(22, 32, 75, 150, 'd6279585-7e9d-a7d9-50b8-d20071ff20d5', 5, 'Produk bagus, tapi pengiriman agak lama sampai. Pelayanan chat seller ramah dan cepat balas.', NULL, 1, 'd6279585-7e9d-a7d9-50b8-d20071ff20d5', 'd6279585-7e9d-a7d9-50b8-d20071ff20d5', '2026-11-12 09:11:02', '2026-11-12 09:11:02', NULL),
(23, 15, 77, 152, '6fbb8c86-9231-b8a1-88d3-646663652350', 4, 'Modelnya lebih bagus aslinya dibanding foto. Bahan tidak panas, nyaman untuk cuaca di sini.', NULL, 1, '6fbb8c86-9231-b8a1-88d3-646663652350', '6fbb8c86-9231-b8a1-88d3-646663652350', '2026-11-12 05:53:02', '2026-11-12 05:53:02', NULL),
(24, 27, 77, 153, '6fbb8c86-9231-b8a1-88d3-646663652350', 4, 'Sudah dua kali belanja di toko ini, konsisten kualitasnya. Pengemasan selalu aman.', NULL, 1, '6fbb8c86-9231-b8a1-88d3-646663652350', '6fbb8c86-9231-b8a1-88d3-646663652350', '2026-11-12 05:53:02', '2026-11-12 05:53:02', NULL),
(25, 19, 78, 154, 'c0d89002-20de-8855-3335-a6eb7ec4038f', 3, 'Sesuai harga, jahitan bagian dalam ada yang kurang rapi. Untuk harian masih layak dipakai.', NULL, 1, 'c0d89002-20de-8855-3335-a6eb7ec4038f', 'c0d89002-20de-8855-3335-a6eb7ec4038f', '2026-11-12 04:14:02', '2026-11-12 04:14:02', NULL),
(26, 30, 78, 155, 'c0d89002-20de-8855-3335-a6eb7ec4038f', 3, 'Barang oke, sayang pengiriman hampir seminggu. Seller sempat bantu cek posisi paket, terima kasih.', NULL, 1, 'c0d89002-20de-8855-3335-a6eb7ec4038f', 'c0d89002-20de-8855-3335-a6eb7ec4038f', '2026-11-12 04:14:02', '2026-11-12 04:14:02', NULL),
(27, 44, 78, 156, 'c0d89002-20de-8855-3335-a6eb7ec4038f', 3, 'Sesuai harga, jahitan bagian dalam ada yang kurang rapi. Untuk harian masih layak dipakai.', NULL, 1, 'c0d89002-20de-8855-3335-a6eb7ec4038f', 'c0d89002-20de-8855-3335-a6eb7ec4038f', '2026-11-12 04:14:02', '2026-11-12 04:14:02', NULL),
(28, 25, 80, 158, 'bf03fbce-d1d2-7300-136d-f61e4acdbe91', 5, 'Sesuai ekspektasi, kemasan rapi dan ada kartu ucapan terima kasih dari toko. Nice touch.', NULL, 1, 'bf03fbce-d1d2-7300-136d-f61e4acdbe91', 'bf03fbce-d1d2-7300-136d-f61e4acdbe91', '2026-11-12 00:55:02', '2026-11-12 00:55:02', NULL),
(29, 38, 80, 159, 'bf03fbce-d1d2-7300-136d-f61e4acdbe91', 5, 'Bahan adem dan tidak kaku, dipakai ke kantor tetap nyaman. Size chart-nya akurat.', NULL, 1, 'bf03fbce-d1d2-7300-136d-f61e4acdbe91', 'bf03fbce-d1d2-7300-136d-f61e4acdbe91', '2026-11-12 00:55:02', '2026-11-12 00:55:02', NULL),
(30, 28, 81, 160, '1e269f2c-8386-1ef0-ff8e-1494bf3746a3', 4, 'Awalnya ragu beli online, ternyata bahannya tebal dan tidak menerawang. Puas.', NULL, 1, '1e269f2c-8386-1ef0-ff8e-1494bf3746a3', '1e269f2c-8386-1ef0-ff8e-1494bf3746a3', '2026-11-11 23:16:02', '2026-11-11 23:16:02', NULL),
(31, 42, 81, 161, '1e269f2c-8386-1ef0-ff8e-1494bf3746a3', 4, 'Bagus untuk harga segini, tapi ada benang lepas sedikit di bagian manset. Selebihnya oke.', NULL, 1, '1e269f2c-8386-1ef0-ff8e-1494bf3746a3', '1e269f2c-8386-1ef0-ff8e-1494bf3746a3', '2026-11-11 23:16:02', '2026-11-11 23:16:02', NULL),
(32, 54, 81, 162, '1e269f2c-8386-1ef0-ff8e-1494bf3746a3', 4, 'Bahannya sesuai deskripsi, adem dipakai seharian. Jahitan rapi, packing juga aman pakai bubble wrap.', NULL, 1, '1e269f2c-8386-1ef0-ff8e-1494bf3746a3', '1e269f2c-8386-1ef0-ff8e-1494bf3746a3', '2026-11-11 23:16:02', '2026-11-11 23:16:02', NULL),
(33, 35, 83, 164, '62846adc-59a0-1459-ca7b-6d67b7cb98bb', 5, 'Sesuai ekspektasi, kemasan rapi dan ada kartu ucapan terima kasih dari toko. Nice touch.', NULL, 1, '62846adc-59a0-1459-ca7b-6d67b7cb98bb', '62846adc-59a0-1459-ca7b-6d67b7cb98bb', '2026-11-11 19:57:02', '2026-11-11 19:57:02', NULL),
(34, 49, 83, 165, '62846adc-59a0-1459-ca7b-6d67b7cb98bb', 5, 'Sudah dua kali belanja di toko ini, konsisten kualitasnya. Pengemasan selalu aman.', NULL, 1, '62846adc-59a0-1459-ca7b-6d67b7cb98bb', '62846adc-59a0-1459-ca7b-6d67b7cb98bb', '2026-11-11 19:57:02', '2026-11-11 19:57:02', NULL),
(35, 39, 84, 166, 'dee09934-26d8-29d8-36e1-1781d5de4a77', 5, 'Barang sampai dalam kondisi mulus, tidak ada cacat. Ukuran sesuai, cocok untuk sehari-hari.', NULL, 1, 'dee09934-26d8-29d8-36e1-1781d5de4a77', 'dee09934-26d8-29d8-36e1-1781d5de4a77', '2026-11-11 18:18:02', '2026-11-11 18:18:02', NULL),
(36, 52, 84, 167, 'dee09934-26d8-29d8-36e1-1781d5de4a77', 5, 'Pesan warna hitam, ternyata sedikit lebih gelap dari foto tapi justru lebih elegan. Recommended.', NULL, 1, 'dee09934-26d8-29d8-36e1-1781d5de4a77', 'dee09934-26d8-29d8-36e1-1781d5de4a77', '2026-11-11 18:18:02', '2026-11-11 18:18:02', NULL),
(37, 64, 84, 168, 'dee09934-26d8-29d8-36e1-1781d5de4a77', 5, 'Ukuran pas dengan size chart, warnanya sama seperti di foto. Pengiriman cepat, recommended seller.', NULL, 1, 'dee09934-26d8-29d8-36e1-1781d5de4a77', 'dee09934-26d8-29d8-36e1-1781d5de4a77', '2026-11-11 18:18:02', '2026-11-11 18:18:02', NULL),
(38, 47, 86, 170, '3221a57c-2610-e0e3-593c-6b7c8f444086', 5, 'Sesuai ekspektasi, kemasan rapi dan ada kartu ucapan terima kasih dari toko. Nice touch.', NULL, 1, '3221a57c-2610-e0e3-593c-6b7c8f444086', '3221a57c-2610-e0e3-593c-6b7c8f444086', '2026-11-10 06:33:02', '2026-11-10 06:33:02', NULL),
(39, 60, 86, 171, '3221a57c-2610-e0e3-593c-6b7c8f444086', 5, 'Cepat sampai, barang original, dan seller fast response saat tanya stok. Terima kasih.', NULL, 1, '3221a57c-2610-e0e3-593c-6b7c8f444086', '3221a57c-2610-e0e3-593c-6b7c8f444086', '2026-11-10 06:33:02', '2026-11-10 06:33:02', NULL),
(40, 50, 87, 172, '487eb68d-0b76-e01a-b043-b572294cd606', 5, 'Awalnya ragu beli online, ternyata bahannya tebal dan tidak menerawang. Puas.', NULL, 1, '487eb68d-0b76-e01a-b043-b572294cd606', '487eb68d-0b76-e01a-b043-b572294cd606', '2026-11-09 22:41:02', '2026-11-09 22:41:02', NULL),
(41, 62, 87, 173, '487eb68d-0b76-e01a-b043-b572294cd606', 5, 'Sudah dua kali belanja di toko ini, konsisten kualitasnya. Pengemasan selalu aman.', NULL, 1, '487eb68d-0b76-e01a-b043-b572294cd606', '487eb68d-0b76-e01a-b043-b572294cd606', '2026-11-09 22:41:02', '2026-11-09 22:41:02', NULL),
(42, 71, 87, 174, '487eb68d-0b76-e01a-b043-b572294cd606', 5, 'Bagus untuk harga segini, tapi ada benang lepas sedikit di bagian manset. Selebihnya oke.', NULL, 1, '487eb68d-0b76-e01a-b043-b572294cd606', '487eb68d-0b76-e01a-b043-b572294cd606', '2026-11-09 22:41:02', '2026-11-09 22:41:02', NULL),
(43, 57, 89, 176, '306cd17b-c0d6-b1b1-cf06-11f5c3ebfabc', 3, 'Sesuai harga, jahitan bagian dalam ada yang kurang rapi. Untuk harian masih layak dipakai.', NULL, 1, '306cd17b-c0d6-b1b1-cf06-11f5c3ebfabc', '306cd17b-c0d6-b1b1-cf06-11f5c3ebfabc', '2026-11-09 06:59:02', '2026-11-09 06:59:02', NULL),
(44, 68, 89, 177, '306cd17b-c0d6-b1b1-cf06-11f5c3ebfabc', 3, 'Bahannya enak, tapi ada lipatan bekas packing yang susah hilang. Bisa disetrika sih.', NULL, 1, '306cd17b-c0d6-b1b1-cf06-11f5c3ebfabc', '306cd17b-c0d6-b1b1-cf06-11f5c3ebfabc', '2026-11-09 06:59:02', '2026-11-09 06:59:02', NULL),
(45, 61, 90, 178, '0112d875-50e7-9f82-e3db-8b236203ae0c', 5, 'Sesuai ekspektasi, kemasan rapi dan ada kartu ucapan terima kasih dari toko. Nice touch.', NULL, 1, '0112d875-50e7-9f82-e3db-8b236203ae0c', '0112d875-50e7-9f82-e3db-8b236203ae0c', '2026-11-08 23:08:02', '2026-11-08 23:08:02', NULL),
(46, 70, 90, 179, '0112d875-50e7-9f82-e3db-8b236203ae0c', 5, 'Barang sampai dalam kondisi mulus, tidak ada cacat. Ukuran sesuai, cocok untuk sehari-hari.', NULL, 1, '0112d875-50e7-9f82-e3db-8b236203ae0c', '0112d875-50e7-9f82-e3db-8b236203ae0c', '2026-11-08 23:08:02', '2026-11-08 23:08:02', NULL),
(47, 19, 90, 180, '0112d875-50e7-9f82-e3db-8b236203ae0c', 5, 'Awalnya ragu beli online, ternyata bahannya tebal dan tidak menerawang. Puas.', NULL, 1, '0112d875-50e7-9f82-e3db-8b236203ae0c', '0112d875-50e7-9f82-e3db-8b236203ae0c', '2026-11-08 23:08:02', '2026-11-08 23:08:02', NULL),
(48, 66, 92, 182, 'a83143c9-3367-62a4-1a5c-d250674a1646', 5, 'Suka banget sama potongannya, jatuhnya rapi di badan. Akan repeat order warna lain.', NULL, 1, 'a83143c9-3367-62a4-1a5c-d250674a1646', 'a83143c9-3367-62a4-1a5c-d250674a1646', '2026-11-08 07:25:02', '2026-11-08 07:25:02', NULL),
(49, 82, 92, 183, 'a83143c9-3367-62a4-1a5c-d250674a1646', 5, 'Sudah dua kali belanja di toko ini, konsisten kualitasnya. Pengemasan selalu aman.', NULL, 1, 'a83143c9-3367-62a4-1a5c-d250674a1646', 'a83143c9-3367-62a4-1a5c-d250674a1646', '2026-11-08 07:25:02', '2026-11-08 07:25:02', NULL),
(50, 69, 93, 184, '7bdd6f0a-3f48-e6e8-ee16-ec8e84ff19ca', 4, 'Produk bagus, tapi pengiriman agak lama sampai. Pelayanan chat seller ramah dan cepat balas.', NULL, 1, '7bdd6f0a-3f48-e6e8-ee16-ec8e84ff19ca', '7bdd6f0a-3f48-e6e8-ee16-ec8e84ff19ca', '2026-11-07 23:34:02', '2026-11-07 23:34:02', NULL),
(51, 96, 93, 185, '7bdd6f0a-3f48-e6e8-ee16-ec8e84ff19ca', 4, 'Sudah dua kali belanja di toko ini, konsisten kualitasnya. Pengemasan selalu aman.', NULL, 1, '7bdd6f0a-3f48-e6e8-ee16-ec8e84ff19ca', '7bdd6f0a-3f48-e6e8-ee16-ec8e84ff19ca', '2026-11-07 23:34:02', '2026-11-07 23:34:02', NULL),
(52, 21, 93, 186, '7bdd6f0a-3f48-e6e8-ee16-ec8e84ff19ca', 4, 'Bahannya sesuai deskripsi, adem dipakai seharian. Jahitan rapi, packing juga aman pakai bubble wrap.', NULL, 1, '7bdd6f0a-3f48-e6e8-ee16-ec8e84ff19ca', '7bdd6f0a-3f48-e6e8-ee16-ec8e84ff19ca', '2026-11-07 23:34:02', '2026-11-07 23:34:02', NULL),
(53, 73, 95, 188, '6523275d-f48d-41a5-0d49-72d139ce2711', 5, 'Ukuran pas dengan size chart, warnanya sama seperti di foto. Pengiriman cepat, recommended seller.', NULL, 1, '6523275d-f48d-41a5-0d49-72d139ce2711', '6523275d-f48d-41a5-0d49-72d139ce2711', '2026-11-07 07:51:02', '2026-11-07 07:51:02', NULL),
(54, 21, 95, 189, '6523275d-f48d-41a5-0d49-72d139ce2711', 5, 'Kualitas di atas harga. Sudah dicuci dua kali belum melar dan warnanya belum pudar.', NULL, 1, '6523275d-f48d-41a5-0d49-72d139ce2711', '6523275d-f48d-41a5-0d49-72d139ce2711', '2026-11-07 07:51:02', '2026-11-07 07:51:02', NULL),
(55, 88, 96, 190, '777afe4c-4837-d716-a13c-846e9cd8cd7a', 5, 'Sesuai ekspektasi, kemasan rapi dan ada kartu ucapan terima kasih dari toko. Nice touch.', NULL, 1, '777afe4c-4837-d716-a13c-846e9cd8cd7a', '777afe4c-4837-d716-a13c-846e9cd8cd7a', '2026-11-07 00:00:02', '2026-11-07 00:00:02', NULL),
(56, 22, 96, 191, '777afe4c-4837-d716-a13c-846e9cd8cd7a', 5, 'Harga masuk akal untuk kualitas seperti ini. Jahitan di bagian bawah kuat, tidak mudah lepas.', NULL, 1, '777afe4c-4837-d716-a13c-846e9cd8cd7a', '777afe4c-4837-d716-a13c-846e9cd8cd7a', '2026-11-07 00:00:02', '2026-11-07 00:00:02', NULL),
(57, 23, 96, 192, '777afe4c-4837-d716-a13c-846e9cd8cd7a', 5, 'Cepat sampai, barang original, dan seller fast response saat tanya stok. Terima kasih.', NULL, 1, '777afe4c-4837-d716-a13c-846e9cd8cd7a', '777afe4c-4837-d716-a13c-846e9cd8cd7a', '2026-11-07 00:00:02', '2026-11-07 00:00:02', NULL),
(58, 23, 98, 194, 'c323571d-d64c-f97c-2808-140d3610f2eb', 5, 'Cepat sampai, barang original, dan seller fast response saat tanya stok. Terima kasih.', NULL, 1, 'c323571d-d64c-f97c-2808-140d3610f2eb', 'c323571d-d64c-f97c-2808-140d3610f2eb', '2026-11-06 08:17:02', '2026-11-06 08:17:02', NULL),
(59, 23, 98, 195, 'c323571d-d64c-f97c-2808-140d3610f2eb', 5, 'Cepat sampai, barang original, dan seller fast response saat tanya stok. Terima kasih.', NULL, 1, 'c323571d-d64c-f97c-2808-140d3610f2eb', 'c323571d-d64c-f97c-2808-140d3610f2eb', '2026-11-06 08:17:02', '2026-11-06 08:17:02', NULL),
(60, 24, 99, 196, '89a52d76-3cfc-c24c-cb98-21a4a56adbda', 5, 'Ukuran pas dengan size chart, warnanya sama seperti di foto. Pengiriman cepat, recommended seller.', NULL, 1, '89a52d76-3cfc-c24c-cb98-21a4a56adbda', '89a52d76-3cfc-c24c-cb98-21a4a56adbda', '2026-11-06 00:26:02', '2026-11-06 00:26:02', NULL),
(61, 24, 99, 197, '89a52d76-3cfc-c24c-cb98-21a4a56adbda', 5, 'Ukuran pas dengan size chart, warnanya sama seperti di foto. Pengiriman cepat, recommended seller.', NULL, 1, '89a52d76-3cfc-c24c-cb98-21a4a56adbda', '89a52d76-3cfc-c24c-cb98-21a4a56adbda', '2026-11-06 00:26:02', '2026-11-06 00:26:02', NULL),
(62, 32, 99, 198, '89a52d76-3cfc-c24c-cb98-21a4a56adbda', 5, 'Cepat sampai, barang original, dan seller fast response saat tanya stok. Terima kasih.', NULL, 1, '89a52d76-3cfc-c24c-cb98-21a4a56adbda', '89a52d76-3cfc-c24c-cb98-21a4a56adbda', '2026-11-06 00:26:02', '2026-11-06 00:26:02', NULL),
(63, 25, 101, 200, '37fcb800-49bf-9dbf-c867-fc9d233699c1', 4, 'Harga masuk akal untuk kualitas seperti ini. Jahitan di bagian bawah kuat, tidak mudah lepas.', NULL, 1, '37fcb800-49bf-9dbf-c867-fc9d233699c1', '37fcb800-49bf-9dbf-c867-fc9d233699c1', '2026-11-05 08:43:02', '2026-11-05 08:43:02', NULL),
(64, 27, 101, 201, '37fcb800-49bf-9dbf-c867-fc9d233699c1', 4, 'Awalnya ragu beli online, ternyata bahannya tebal dan tidak menerawang. Puas.', NULL, 1, '37fcb800-49bf-9dbf-c867-fc9d233699c1', '37fcb800-49bf-9dbf-c867-fc9d233699c1', '2026-11-05 08:43:02', '2026-11-05 08:43:02', NULL),
(65, 25, 102, 202, '01e1e35a-187c-d961-58ca-25d230056614', 5, 'Barang sampai dalam kondisi mulus, tidak ada cacat. Ukuran sesuai, cocok untuk sehari-hari.', NULL, 1, '01e1e35a-187c-d961-58ca-25d230056614', '01e1e35a-187c-d961-58ca-25d230056614', '2026-11-05 00:52:02', '2026-11-05 00:52:02', NULL),
(66, 30, 102, 203, '01e1e35a-187c-d961-58ca-25d230056614', 5, 'Harga masuk akal untuk kualitas seperti ini. Jahitan di bagian bawah kuat, tidak mudah lepas.', NULL, 1, '01e1e35a-187c-d961-58ca-25d230056614', '01e1e35a-187c-d961-58ca-25d230056614', '2026-11-05 00:52:02', '2026-11-05 00:52:02', NULL),
(67, 44, 102, 204, '01e1e35a-187c-d961-58ca-25d230056614', 5, 'Cepat sampai, barang original, dan seller fast response saat tanya stok. Terima kasih.', NULL, 1, '01e1e35a-187c-d961-58ca-25d230056614', '01e1e35a-187c-d961-58ca-25d230056614', '2026-11-05 00:52:02', '2026-11-05 00:52:02', NULL),
(68, 26, 104, 206, '20d503c5-6e99-eb51-0cbd-2725f7e2e876', 5, 'Ukuran pas dengan size chart, warnanya sama seperti di foto. Pengiriman cepat, recommended seller.', NULL, 1, '20d503c5-6e99-eb51-0cbd-2725f7e2e876', '20d503c5-6e99-eb51-0cbd-2725f7e2e876', '2026-11-04 09:09:02', '2026-11-04 09:09:02', NULL),
(69, 38, 104, 207, '20d503c5-6e99-eb51-0cbd-2725f7e2e876', 5, 'Barang sampai dalam kondisi mulus, tidak ada cacat. Ukuran sesuai, cocok untuk sehari-hari.', NULL, 1, '20d503c5-6e99-eb51-0cbd-2725f7e2e876', '20d503c5-6e99-eb51-0cbd-2725f7e2e876', '2026-11-04 09:09:02', '2026-11-04 09:09:02', NULL),
(70, 28, 105, 208, 'dc41400c-122c-90f0-d943-48a55f6f9abd', 4, 'Bahan adem dan tidak kaku, dipakai ke kantor tetap nyaman. Size chart-nya akurat.', NULL, 1, 'dc41400c-122c-90f0-d943-48a55f6f9abd', 'dc41400c-122c-90f0-d943-48a55f6f9abd', '2026-11-04 01:18:02', '2026-11-04 01:18:02', NULL),
(71, 42, 105, 209, 'dc41400c-122c-90f0-d943-48a55f6f9abd', 4, 'Harga masuk akal untuk kualitas seperti ini. Jahitan di bagian bawah kuat, tidak mudah lepas.', NULL, 1, 'dc41400c-122c-90f0-d943-48a55f6f9abd', 'dc41400c-122c-90f0-d943-48a55f6f9abd', '2026-11-04 01:18:02', '2026-11-04 01:18:02', NULL),
(72, 54, 105, 210, 'dc41400c-122c-90f0-d943-48a55f6f9abd', 4, 'Modelnya lebih bagus aslinya dibanding foto. Bahan tidak panas, nyaman untuk cuaca di sini.', NULL, 1, 'dc41400c-122c-90f0-d943-48a55f6f9abd', 'dc41400c-122c-90f0-d943-48a55f6f9abd', '2026-11-04 01:18:02', '2026-11-04 01:18:02', NULL),
(73, 35, 107, 212, '847439d3-e0dd-ae2f-0ee8-9a07860386bd', 5, 'Bahannya sesuai deskripsi, adem dipakai seharian. Jahitan rapi, packing juga aman pakai bubble wrap.', NULL, 1, '847439d3-e0dd-ae2f-0ee8-9a07860386bd', '847439d3-e0dd-ae2f-0ee8-9a07860386bd', '2026-11-03 09:35:02', '2026-11-03 09:35:02', NULL),
(74, 49, 107, 213, '847439d3-e0dd-ae2f-0ee8-9a07860386bd', 5, 'Awalnya ragu beli online, ternyata bahannya tebal dan tidak menerawang. Puas.', NULL, 1, '847439d3-e0dd-ae2f-0ee8-9a07860386bd', '847439d3-e0dd-ae2f-0ee8-9a07860386bd', '2026-11-03 09:35:02', '2026-11-03 09:35:02', NULL),
(75, 39, 108, 214, '0dc38b96-2c45-1fef-1143-7c08e97cf3cf', 5, 'Kualitas di atas harga. Sudah dicuci dua kali belum melar dan warnanya belum pudar.', NULL, 1, '0dc38b96-2c45-1fef-1143-7c08e97cf3cf', '0dc38b96-2c45-1fef-1143-7c08e97cf3cf', '2026-11-03 01:44:02', '2026-11-03 01:44:02', NULL),
(76, 52, 108, 215, '0dc38b96-2c45-1fef-1143-7c08e97cf3cf', 5, 'Suka banget sama potongannya, jatuhnya rapi di badan. Akan repeat order warna lain.', NULL, 1, '0dc38b96-2c45-1fef-1143-7c08e97cf3cf', '0dc38b96-2c45-1fef-1143-7c08e97cf3cf', '2026-11-03 01:44:02', '2026-11-03 01:44:02', NULL),
(77, 64, 108, 216, '0dc38b96-2c45-1fef-1143-7c08e97cf3cf', 5, 'Pesan warna hitam, ternyata sedikit lebih gelap dari foto tapi justru lebih elegan. Recommended.', NULL, 1, '0dc38b96-2c45-1fef-1143-7c08e97cf3cf', '0dc38b96-2c45-1fef-1143-7c08e97cf3cf', '2026-11-03 01:44:02', '2026-11-03 01:44:02', NULL),
(78, 47, 110, 218, 'd1158e10-1fb5-8d0b-7ab2-b5ad00354462', 5, 'Bahannya sesuai deskripsi, adem dipakai seharian. Jahitan rapi, packing juga aman pakai bubble wrap.', NULL, 1, 'd1158e10-1fb5-8d0b-7ab2-b5ad00354462', 'd1158e10-1fb5-8d0b-7ab2-b5ad00354462', '2026-11-02 10:02:02', '2026-11-02 10:02:02', NULL),
(79, 60, 110, 219, 'd1158e10-1fb5-8d0b-7ab2-b5ad00354462', 5, 'Sesuai ekspektasi, kemasan rapi dan ada kartu ucapan terima kasih dari toko. Nice touch.', NULL, 1, 'd1158e10-1fb5-8d0b-7ab2-b5ad00354462', 'd1158e10-1fb5-8d0b-7ab2-b5ad00354462', '2026-11-02 10:02:02', '2026-11-02 10:02:02', NULL),
(80, 50, 111, 220, 'fb358165-f121-342b-620b-53a635217b97', 3, 'Sesuai harga, jahitan bagian dalam ada yang kurang rapi. Untuk harian masih layak dipakai.', NULL, 1, 'fb358165-f121-342b-620b-53a635217b97', 'fb358165-f121-342b-620b-53a635217b97', '2026-11-02 02:10:02', '2026-11-02 02:10:02', NULL),
(81, 62, 111, 221, 'fb358165-f121-342b-620b-53a635217b97', 3, 'Bahannya enak, tapi ada lipatan bekas packing yang susah hilang. Bisa disetrika sih.', NULL, 1, 'fb358165-f121-342b-620b-53a635217b97', 'fb358165-f121-342b-620b-53a635217b97', '2026-11-02 02:10:02', '2026-11-02 02:10:02', NULL),
(82, 71, 111, 222, 'fb358165-f121-342b-620b-53a635217b97', 3, 'Barang oke, sayang pengiriman hampir seminggu. Seller sempat bantu cek posisi paket, terima kasih.', NULL, 1, 'fb358165-f121-342b-620b-53a635217b97', 'fb358165-f121-342b-620b-53a635217b97', '2026-11-02 02:10:02', '2026-11-02 02:10:02', NULL),
(83, 57, 113, 224, '8f90ee9c-9303-a25d-6d77-f711e7ef84e6', 4, 'Cepat sampai, barang original, dan seller fast response saat tanya stok. Terima kasih.', NULL, 1, '8f90ee9c-9303-a25d-6d77-f711e7ef84e6', '8f90ee9c-9303-a25d-6d77-f711e7ef84e6', '2026-11-01 10:28:02', '2026-11-01 10:28:02', NULL),
(84, 68, 113, 225, '8f90ee9c-9303-a25d-6d77-f711e7ef84e6', 4, 'Produk bagus, tapi pengiriman agak lama sampai. Pelayanan chat seller ramah dan cepat balas.', NULL, 1, '8f90ee9c-9303-a25d-6d77-f711e7ef84e6', '8f90ee9c-9303-a25d-6d77-f711e7ef84e6', '2026-11-01 10:28:02', '2026-11-01 10:28:02', NULL),
(85, 61, 114, 226, '4fe4a5a9-ca82-3950-aa71-8f06a919f0bf', 5, 'Bahannya sesuai deskripsi, adem dipakai seharian. Jahitan rapi, packing juga aman pakai bubble wrap.', NULL, 1, '4fe4a5a9-ca82-3950-aa71-8f06a919f0bf', '4fe4a5a9-ca82-3950-aa71-8f06a919f0bf', '2026-11-01 02:36:02', '2026-11-01 02:36:02', NULL),
(86, 70, 114, 227, '4fe4a5a9-ca82-3950-aa71-8f06a919f0bf', 5, 'Kualitas di atas harga. Sudah dicuci dua kali belum melar dan warnanya belum pudar.', NULL, 1, '4fe4a5a9-ca82-3950-aa71-8f06a919f0bf', '4fe4a5a9-ca82-3950-aa71-8f06a919f0bf', '2026-11-01 02:36:02', '2026-11-01 02:36:02', NULL),
(87, 32, 114, 228, '4fe4a5a9-ca82-3950-aa71-8f06a919f0bf', 5, 'Sudah dua kali belanja di toko ini, konsisten kualitasnya. Pengemasan selalu aman.', NULL, 1, '4fe4a5a9-ca82-3950-aa71-8f06a919f0bf', '4fe4a5a9-ca82-3950-aa71-8f06a919f0bf', '2026-11-01 02:36:02', '2026-11-01 02:36:02', NULL),
(88, 66, 116, 230, '4920f24e-514f-e2cd-08c0-3adf50220e53', 5, 'Bagus untuk harga segini, tapi ada benang lepas sedikit di bagian manset. Selebihnya oke.', NULL, 1, '4920f24e-514f-e2cd-08c0-3adf50220e53', '4920f24e-514f-e2cd-08c0-3adf50220e53', '2026-10-31 10:54:02', '2026-10-31 10:54:02', NULL),
(89, 82, 116, 231, '4920f24e-514f-e2cd-08c0-3adf50220e53', 5, 'Awalnya ragu beli online, ternyata bahannya tebal dan tidak menerawang. Puas.', NULL, 1, '4920f24e-514f-e2cd-08c0-3adf50220e53', '4920f24e-514f-e2cd-08c0-3adf50220e53', '2026-10-31 10:54:02', '2026-10-31 10:54:02', NULL),
(90, 69, 117, 232, 'be1f7f6c-786f-886f-70fd-1adf76c06110', 4, 'Cepat sampai, barang original, dan seller fast response saat tanya stok. Terima kasih.', NULL, 1, 'be1f7f6c-786f-886f-70fd-1adf76c06110', 'be1f7f6c-786f-886f-70fd-1adf76c06110', '2026-10-31 03:02:02', '2026-10-31 03:02:02', NULL),
(91, 96, 117, 233, 'be1f7f6c-786f-886f-70fd-1adf76c06110', 4, 'Awalnya ragu beli online, ternyata bahannya tebal dan tidak menerawang. Puas.', NULL, 1, 'be1f7f6c-786f-886f-70fd-1adf76c06110', 'be1f7f6c-786f-886f-70fd-1adf76c06110', '2026-10-31 03:02:02', '2026-10-31 03:02:02', NULL),
(92, 33, 117, 234, 'be1f7f6c-786f-886f-70fd-1adf76c06110', 4, 'Produk bagus, tapi pengiriman agak lama sampai. Pelayanan chat seller ramah dan cepat balas.', NULL, 1, 'be1f7f6c-786f-886f-70fd-1adf76c06110', 'be1f7f6c-786f-886f-70fd-1adf76c06110', '2026-10-31 03:02:02', '2026-10-31 03:02:02', NULL),
(93, 73, 119, 236, '8234251c-184e-4d14-e02b-63b6b5869842', 5, 'Pesan warna hitam, ternyata sedikit lebih gelap dari foto tapi justru lebih elegan. Recommended.', NULL, 1, '8234251c-184e-4d14-e02b-63b6b5869842', '8234251c-184e-4d14-e02b-63b6b5869842', '2026-10-30 11:20:02', '2026-10-30 11:20:02', NULL),
(94, 35, 119, 237, '8234251c-184e-4d14-e02b-63b6b5869842', 5, 'Cepat sampai, barang original, dan seller fast response saat tanya stok. Terima kasih.', NULL, 1, '8234251c-184e-4d14-e02b-63b6b5869842', '8234251c-184e-4d14-e02b-63b6b5869842', '2026-10-30 11:20:02', '2026-10-30 11:20:02', NULL),
(95, 88, 120, 238, 'dcf53c7b-7960-20e7-e37b-ce04efcd9d31', 5, 'Bahannya sesuai deskripsi, adem dipakai seharian. Jahitan rapi, packing juga aman pakai bubble wrap.', NULL, 1, 'dcf53c7b-7960-20e7-e37b-ce04efcd9d31', 'dcf53c7b-7960-20e7-e37b-ce04efcd9d31', '2026-10-30 03:29:02', '2026-10-30 03:29:02', NULL),
(96, 35, 120, 239, 'dcf53c7b-7960-20e7-e37b-ce04efcd9d31', 5, 'Bagus untuk harga segini, tapi ada benang lepas sedikit di bagian manset. Selebihnya oke.', NULL, 1, 'dcf53c7b-7960-20e7-e37b-ce04efcd9d31', 'dcf53c7b-7960-20e7-e37b-ce04efcd9d31', '2026-10-30 03:29:02', '2026-10-30 03:29:02', NULL),
(97, 35, 120, 240, 'dcf53c7b-7960-20e7-e37b-ce04efcd9d31', 5, 'Bagus untuk harga segini, tapi ada benang lepas sedikit di bagian manset. Selebihnya oke.', NULL, 1, 'dcf53c7b-7960-20e7-e37b-ce04efcd9d31', 'dcf53c7b-7960-20e7-e37b-ce04efcd9d31', '2026-10-30 03:29:02', '2026-10-30 03:29:02', NULL),
(98, 36, 122, 242, '331429a9-ba63-a268-3e5d-49912a26b5df', 3, 'Bahannya enak, tapi ada lipatan bekas packing yang susah hilang. Bisa disetrika sih.', NULL, 1, '331429a9-ba63-a268-3e5d-49912a26b5df', '331429a9-ba63-a268-3e5d-49912a26b5df', '2026-10-29 11:46:02', '2026-10-29 11:46:02', NULL),
(99, 36, 122, 243, '331429a9-ba63-a268-3e5d-49912a26b5df', 3, 'Bahannya enak, tapi ada lipatan bekas packing yang susah hilang. Bisa disetrika sih.', NULL, 1, '331429a9-ba63-a268-3e5d-49912a26b5df', '331429a9-ba63-a268-3e5d-49912a26b5df', '2026-10-29 11:46:02', '2026-10-29 11:46:02', NULL),
(100, 38, 123, 244, '03d879fa-ea37-16e7-0382-d9e05bce0ea0', 5, 'Sudah dua kali belanja di toko ini, konsisten kualitasnya. Pengemasan selalu aman.', NULL, 1, '03d879fa-ea37-16e7-0382-d9e05bce0ea0', '03d879fa-ea37-16e7-0382-d9e05bce0ea0', '2026-10-29 03:55:02', '2026-10-29 03:55:02', NULL),
(101, 38, 123, 245, '03d879fa-ea37-16e7-0382-d9e05bce0ea0', 5, 'Sudah dua kali belanja di toko ini, konsisten kualitasnya. Pengemasan selalu aman.', NULL, 1, '03d879fa-ea37-16e7-0382-d9e05bce0ea0', '03d879fa-ea37-16e7-0382-d9e05bce0ea0', '2026-10-29 03:55:02', '2026-10-29 03:55:02', NULL),
(102, 38, 123, 246, '03d879fa-ea37-16e7-0382-d9e05bce0ea0', 5, 'Sudah dua kali belanja di toko ini, konsisten kualitasnya. Pengemasan selalu aman.', NULL, 1, '03d879fa-ea37-16e7-0382-d9e05bce0ea0', '03d879fa-ea37-16e7-0382-d9e05bce0ea0', '2026-10-29 03:55:02', '2026-10-29 03:55:02', NULL),
(103, 38, 125, 248, 'dcaf3e0f-c3e0-3dd6-e158-cca1ec2560ad', 4, 'Bagus untuk harga segini, tapi ada benang lepas sedikit di bagian manset. Selebihnya oke.', NULL, 1, 'dcaf3e0f-c3e0-3dd6-e158-cca1ec2560ad', 'dcaf3e0f-c3e0-3dd6-e158-cca1ec2560ad', '2026-10-28 12:12:02', '2026-10-28 12:12:02', NULL),
(104, 38, 125, 249, 'dcaf3e0f-c3e0-3dd6-e158-cca1ec2560ad', 4, 'Bagus untuk harga segini, tapi ada benang lepas sedikit di bagian manset. Selebihnya oke.', NULL, 1, 'dcaf3e0f-c3e0-3dd6-e158-cca1ec2560ad', 'dcaf3e0f-c3e0-3dd6-e158-cca1ec2560ad', '2026-10-28 12:12:02', '2026-10-28 12:12:02', NULL),
(105, 38, 126, 250, 'a59b13c6-da0d-cc36-aa08-7fdb038f3e7a', 5, 'Bahan adem dan tidak kaku, dipakai ke kantor tetap nyaman. Size chart-nya akurat.', NULL, 1, 'a59b13c6-da0d-cc36-aa08-7fdb038f3e7a', 'a59b13c6-da0d-cc36-aa08-7fdb038f3e7a', '2026-10-28 04:21:02', '2026-10-28 04:21:02', NULL),
(106, 38, 126, 251, 'a59b13c6-da0d-cc36-aa08-7fdb038f3e7a', 5, 'Bahan adem dan tidak kaku, dipakai ke kantor tetap nyaman. Size chart-nya akurat.', NULL, 1, 'a59b13c6-da0d-cc36-aa08-7fdb038f3e7a', 'a59b13c6-da0d-cc36-aa08-7fdb038f3e7a', '2026-10-28 04:21:02', '2026-10-28 04:21:02', NULL),
(107, 44, 126, 252, 'a59b13c6-da0d-cc36-aa08-7fdb038f3e7a', 5, 'Sesuai ekspektasi, kemasan rapi dan ada kartu ucapan terima kasih dari toko. Nice touch.', NULL, 1, 'a59b13c6-da0d-cc36-aa08-7fdb038f3e7a', 'a59b13c6-da0d-cc36-aa08-7fdb038f3e7a', '2026-10-28 04:21:02', '2026-10-28 04:21:02', NULL),
(108, 40, 128, 254, '32dc5cb6-dfa4-d861-17b7-16128391058c', 5, 'Barang sampai dalam kondisi mulus, tidak ada cacat. Ukuran sesuai, cocok untuk sehari-hari.', NULL, 1, '32dc5cb6-dfa4-d861-17b7-16128391058c', '32dc5cb6-dfa4-d861-17b7-16128391058c', '2026-10-27 12:38:02', '2026-10-27 12:38:02', NULL),
(109, 40, 128, 255, '32dc5cb6-dfa4-d861-17b7-16128391058c', 5, 'Barang sampai dalam kondisi mulus, tidak ada cacat. Ukuran sesuai, cocok untuk sehari-hari.', NULL, 1, '32dc5cb6-dfa4-d861-17b7-16128391058c', '32dc5cb6-dfa4-d861-17b7-16128391058c', '2026-10-27 12:38:02', '2026-10-27 12:38:02', NULL),
(110, 40, 129, 256, 'eb50c71c-58bf-77e2-f3b9-920c25108c95', 4, 'Modelnya lebih bagus aslinya dibanding foto. Bahan tidak panas, nyaman untuk cuaca di sini.', NULL, 1, 'eb50c71c-58bf-77e2-f3b9-920c25108c95', 'eb50c71c-58bf-77e2-f3b9-920c25108c95', '2026-10-27 04:47:02', '2026-10-27 04:47:02', NULL),
(111, 42, 129, 257, 'eb50c71c-58bf-77e2-f3b9-920c25108c95', 4, 'Ukuran pas dengan size chart, warnanya sama seperti di foto. Pengiriman cepat, recommended seller.', NULL, 1, 'eb50c71c-58bf-77e2-f3b9-920c25108c95', 'eb50c71c-58bf-77e2-f3b9-920c25108c95', '2026-10-27 04:47:02', '2026-10-27 04:47:02', NULL),
(112, 54, 129, 258, 'eb50c71c-58bf-77e2-f3b9-920c25108c95', 4, 'Produk bagus, tapi pengiriman agak lama sampai. Pelayanan chat seller ramah dan cepat balas.', NULL, 1, 'eb50c71c-58bf-77e2-f3b9-920c25108c95', 'eb50c71c-58bf-77e2-f3b9-920c25108c95', '2026-10-27 04:47:02', '2026-10-27 04:47:02', NULL),
(113, 41, 131, 260, 'dd1ecb58-65a6-92bf-dd73-2f17941c977b', 5, 'Bahan adem dan tidak kaku, dipakai ke kantor tetap nyaman. Size chart-nya akurat.', NULL, 1, 'dd1ecb58-65a6-92bf-dd73-2f17941c977b', 'dd1ecb58-65a6-92bf-dd73-2f17941c977b', '2026-10-26 13:04:02', '2026-10-26 13:04:02', NULL),
(114, 49, 131, 261, 'dd1ecb58-65a6-92bf-dd73-2f17941c977b', 5, 'Bahan adem dan tidak kaku, dipakai ke kantor tetap nyaman. Size chart-nya akurat.', NULL, 1, 'dd1ecb58-65a6-92bf-dd73-2f17941c977b', 'dd1ecb58-65a6-92bf-dd73-2f17941c977b', '2026-10-26 13:04:02', '2026-10-26 13:04:02', NULL),
(115, 42, 132, 262, '3509673a-1d35-b0b9-594c-ff9f3e19b2a9', 5, 'Suka banget sama potongannya, jatuhnya rapi di badan. Akan repeat order warna lain.', NULL, 1, '3509673a-1d35-b0b9-594c-ff9f3e19b2a9', '3509673a-1d35-b0b9-594c-ff9f3e19b2a9', '2026-10-26 05:13:02', '2026-10-26 05:13:02', NULL),
(116, 52, 132, 263, '3509673a-1d35-b0b9-594c-ff9f3e19b2a9', 5, 'Bagus untuk harga segini, tapi ada benang lepas sedikit di bagian manset. Selebihnya oke.', NULL, 1, '3509673a-1d35-b0b9-594c-ff9f3e19b2a9', '3509673a-1d35-b0b9-594c-ff9f3e19b2a9', '2026-10-26 05:13:02', '2026-10-26 05:13:02', NULL),
(117, 64, 132, 264, '3509673a-1d35-b0b9-594c-ff9f3e19b2a9', 5, 'Suka banget sama potongannya, jatuhnya rapi di badan. Akan repeat order warna lain.', NULL, 1, '3509673a-1d35-b0b9-594c-ff9f3e19b2a9', '3509673a-1d35-b0b9-594c-ff9f3e19b2a9', '2026-10-26 05:13:02', '2026-10-26 05:13:02', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `product_variants`
--

CREATE TABLE `product_variants` (
  `id` bigint UNSIGNED NOT NULL,
  `product_id` bigint UNSIGNED NOT NULL,
  `sku` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(15,2) NOT NULL DEFAULT '0.00',
  `price_original` decimal(15,2) DEFAULT NULL,
  `price_sale` decimal(15,2) DEFAULT NULL,
  `stock` int UNSIGNED NOT NULL DEFAULT '0',
  `po_stock` int UNSIGNED NOT NULL DEFAULT '0',
  `stock_reserved` int UNSIGNED NOT NULL DEFAULT '0',
  `stock_booked` int UNSIGNED NOT NULL DEFAULT '0',
  `stock_preorder` int UNSIGNED NOT NULL DEFAULT '0',
  `max_order_qty` int UNSIGNED NOT NULL DEFAULT '999999',
  `min_stock` int UNSIGNED NOT NULL DEFAULT '0',
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_variants`
--

INSERT INTO `product_variants` (`id`, `product_id`, `sku`, `name`, `price`, `price_original`, `price_sale`, `stock`, `po_stock`, `stock_reserved`, `stock_booked`, `stock_preorder`, `max_order_qty`, `min_stock`, `is_default`, `created_at`, `updated_at`) VALUES
(1, 1, 'FKU-KAOS01-S', 'S', 89000.00, NULL, NULL, 10, 0, 0, 0, 0, 4, 3, 1, '2026-11-14 00:23:55', '2026-11-14 02:24:02'),
(2, 1, 'FKU-KAOS01-M', 'M', 89000.00, NULL, NULL, 23, 0, 0, 0, 0, 7, 3, 0, '2026-11-14 00:23:55', '2026-11-14 02:24:02'),
(3, 1, 'FKU-KAOS01-L', 'L', 89000.00, NULL, NULL, 34, 0, 0, 0, 0, 11, 3, 0, '2026-11-14 00:23:55', '2026-11-14 02:24:02'),
(4, 1, 'FKU-KAOS01-XL', 'XL', 89000.00, NULL, NULL, 45, 0, 0, 0, 0, 15, 3, 0, '2026-11-14 00:23:55', '2026-11-14 02:24:02'),
(5, 1, 'FKU-KAOS01-XXL', 'XXL', 89000.00, NULL, NULL, 14, 0, 0, 0, 0, 4, 3, 0, '2026-11-14 00:23:55', '2026-11-14 02:24:02'),
(6, 2, 'FKU-KAOS02-S', 'S', 129000.00, 159000.00, 129000.00, 6, 0, 0, 0, 0, 3, 3, 1, '2026-11-13 19:23:55', '2026-11-14 02:24:02'),
(7, 2, 'FKU-KAOS02-M', 'M', 129000.00, 159000.00, 129000.00, 18, 0, 0, 0, 0, 6, 3, 0, '2026-11-13 19:23:55', '2026-11-14 02:24:02'),
(8, 2, 'FKU-KAOS02-L', 'L', 129000.00, 159000.00, 129000.00, 29, 0, 0, 0, 0, 9, 3, 0, '2026-11-13 19:23:55', '2026-11-14 02:24:02'),
(9, 2, 'FKU-KAOS02-XL', 'XL', 129000.00, 159000.00, 129000.00, 40, 0, 0, 0, 0, 13, 3, 0, '2026-11-13 19:23:55', '2026-11-14 02:24:02'),
(10, 3, 'FKU-KAOS03-S', 'S', 179000.00, NULL, NULL, 44, 0, 0, 0, 0, 14, 3, 1, '2026-11-13 14:23:55', '2026-11-14 02:24:02'),
(11, 3, 'FKU-KAOS03-M', 'M', 179000.00, NULL, NULL, 13, 0, 0, 0, 0, 4, 3, 0, '2026-11-13 14:23:55', '2026-11-14 02:24:02'),
(12, 3, 'FKU-KAOS03-L', 'L', 179000.00, NULL, NULL, 24, 0, 0, 0, 0, 8, 3, 0, '2026-11-13 14:23:55', '2026-11-14 02:24:02'),
(13, 3, 'FKU-KAOS03-XL', 'XL', 179000.00, NULL, NULL, 35, 0, 0, 0, 0, 11, 3, 0, '2026-11-13 14:23:55', '2026-11-14 02:24:02'),
(14, 4, 'FKU-KAOS04-S', 'S', 119000.00, NULL, NULL, 36, 0, 0, 0, 0, 13, 3, 1, '2026-11-13 09:23:55', '2026-11-14 02:24:02'),
(15, 4, 'FKU-KAOS04-M', 'M', 119000.00, NULL, NULL, 8, 0, 0, 0, 0, 3, 3, 0, '2026-11-13 09:23:55', '2026-11-14 02:24:02'),
(16, 4, 'FKU-KAOS04-L', 'L', 119000.00, NULL, NULL, 19, 0, 0, 0, 0, 6, 3, 0, '2026-11-13 09:23:55', '2026-11-14 02:24:02'),
(17, 4, 'FKU-KAOS04-XL', 'XL', 119000.00, NULL, NULL, 30, 0, 0, 0, 0, 10, 3, 0, '2026-11-13 09:23:55', '2026-11-14 02:24:02'),
(18, 5, 'FKU-KAOS05-S', 'S', 89000.00, 109000.00, 89000.00, 33, 0, 0, 0, 0, 11, 3, 1, '2026-11-13 04:23:55', '2026-11-14 02:24:02'),
(19, 5, 'FKU-KAOS05-M', 'M', 89000.00, 109000.00, 89000.00, 45, 0, 0, 0, 0, 15, 3, 0, '2026-11-13 04:23:55', '2026-11-14 02:24:02'),
(20, 5, 'FKU-KAOS05-L', 'L', 89000.00, 109000.00, 89000.00, 14, 0, 0, 0, 0, 4, 3, 0, '2026-11-13 04:23:55', '2026-11-14 02:24:02'),
(21, 5, 'FKU-KAOS05-XL', 'XL', 89000.00, 109000.00, 89000.00, 25, 0, 0, 0, 0, 8, 3, 0, '2026-11-13 04:23:55', '2026-11-14 02:24:02'),
(22, 6, 'FKU-KAOS06-M', 'M', 169000.00, NULL, NULL, 28, 0, 0, 0, 0, 9, 3, 1, '2026-11-12 23:23:55', '2026-11-14 02:24:02'),
(23, 6, 'FKU-KAOS06-L', 'L', 169000.00, NULL, NULL, 40, 0, 0, 0, 0, 13, 3, 0, '2026-11-12 23:23:55', '2026-11-14 02:24:02'),
(24, 6, 'FKU-KAOS06-XL', 'XL', 169000.00, NULL, NULL, 9, 0, 0, 0, 0, 3, 3, 0, '2026-11-12 23:23:55', '2026-11-14 02:24:02'),
(25, 7, 'FKU-KAOS07-S', 'S', 189000.00, NULL, NULL, 24, 0, 0, 0, 0, 8, 3, 1, '2026-11-12 18:23:55', '2026-11-14 02:24:02'),
(26, 7, 'FKU-KAOS07-M', 'M', 189000.00, NULL, NULL, 35, 0, 0, 0, 0, 11, 3, 0, '2026-11-12 18:23:55', '2026-11-14 02:24:02'),
(27, 7, 'FKU-KAOS07-L', 'L', 189000.00, NULL, NULL, 44, 0, 0, 0, 0, 15, 3, 0, '2026-11-12 18:23:55', '2026-11-14 02:24:02'),
(28, 8, 'FKU-KAOS08-S', 'S', 119000.00, 149000.00, 119000.00, 19, 0, 0, 0, 0, 6, 3, 1, '2026-11-12 13:23:55', '2026-11-14 02:24:02'),
(29, 8, 'FKU-KAOS08-M', 'M', 119000.00, 149000.00, 119000.00, 30, 0, 0, 0, 0, 10, 3, 0, '2026-11-12 13:23:55', '2026-11-14 02:24:02'),
(30, 8, 'FKU-KAOS08-L', 'L', 119000.00, 149000.00, 119000.00, 41, 0, 0, 0, 0, 13, 3, 0, '2026-11-12 13:23:55', '2026-11-14 02:24:02'),
(31, 9, 'FKU-KAOS09-S', 'S', 199000.00, NULL, NULL, 14, 0, 0, 0, 0, 4, 3, 1, '2026-11-12 09:44:00', '2026-11-14 02:24:02'),
(32, 9, 'FKU-KAOS09-M', 'M', 199000.00, NULL, NULL, 25, 0, 0, 0, 0, 8, 3, 0, '2026-11-12 09:44:00', '2026-11-14 02:24:02'),
(33, 9, 'FKU-KAOS09-L', 'L', 199000.00, NULL, NULL, 36, 0, 0, 0, 0, 12, 3, 0, '2026-11-12 09:44:00', '2026-11-14 02:24:02'),
(34, 9, 'FKU-KAOS09-XL', 'XL', 199000.00, NULL, NULL, 47, 0, 0, 0, 0, 15, 3, 0, '2026-11-12 09:44:00', '2026-11-14 02:24:02'),
(35, 10, 'FKU-KAOS10-M', 'M', 79000.00, NULL, NULL, 0, 0, 0, 0, 0, 3, 3, 1, '2026-11-10 10:57:00', '2026-11-14 02:24:02'),
(36, 10, 'FKU-KAOS10-L', 'L', 79000.00, NULL, NULL, 20, 0, 0, 0, 0, 6, 3, 0, '2026-11-10 10:57:00', '2026-11-14 02:24:02'),
(37, 10, 'FKU-KAOS10-XL', 'XL', 79000.00, NULL, NULL, 31, 0, 0, 0, 0, 10, 3, 0, '2026-11-10 10:57:00', '2026-11-14 02:24:02'),
(38, 11, 'FKU-KEME11-S', 'S', 189000.00, 229000.00, 189000.00, 46, 0, 0, 0, 0, 15, 3, 1, '2026-11-08 01:10:00', '2026-11-14 02:24:02'),
(39, 11, 'FKU-KEME11-M', 'M', 189000.00, 229000.00, 189000.00, 15, 0, 0, 0, 0, 5, 3, 0, '2026-11-08 01:10:00', '2026-11-14 02:24:02'),
(40, 11, 'FKU-KEME11-L', 'L', 189000.00, 229000.00, 189000.00, 22, 0, 0, 0, 0, 8, 3, 0, '2026-11-08 01:10:00', '2026-11-14 02:24:02'),
(41, 11, 'FKU-KEME11-XL', 'XL', 189000.00, 229000.00, 189000.00, 37, 0, 0, 0, 0, 12, 3, 0, '2026-11-08 01:10:00', '2026-11-14 02:24:02'),
(42, 12, 'FKU-KEME12-S', 'S', 259000.00, NULL, NULL, 40, 0, 0, 0, 0, 13, 3, 1, '2026-11-06 02:23:00', '2026-11-14 02:24:02'),
(43, 12, 'FKU-KEME12-M', 'M', 259000.00, NULL, NULL, 7, 0, 0, 0, 0, 3, 3, 0, '2026-11-06 02:23:00', '2026-11-14 02:24:02'),
(44, 12, 'FKU-KEME12-L', 'L', 259000.00, NULL, NULL, 21, 0, 0, 0, 0, 7, 3, 0, '2026-11-06 02:23:00', '2026-11-14 02:24:02'),
(45, 12, 'FKU-KEME12-XL', 'XL', 259000.00, NULL, NULL, 32, 0, 0, 0, 0, 10, 3, 0, '2026-11-06 02:23:00', '2026-11-14 02:24:02'),
(46, 13, 'FKU-KEME13-M', 'M', 289000.00, NULL, NULL, 27, 0, 0, 0, 0, 12, 3, 1, '2026-11-04 03:36:00', '2026-11-14 02:24:02'),
(47, 13, 'FKU-KEME13-L', 'L', 289000.00, NULL, NULL, 47, 0, 0, 0, 0, 15, 3, 0, '2026-11-04 03:36:00', '2026-11-14 02:24:02'),
(48, 13, 'FKU-KEME13-XL', 'XL', 289000.00, NULL, NULL, 16, 0, 0, 0, 0, 5, 3, 0, '2026-11-04 03:36:00', '2026-11-14 02:24:02'),
(49, 14, 'FKU-KEME14-S', 'S', 249000.00, 299000.00, 249000.00, 31, 0, 0, 0, 0, 10, 3, 1, '2026-11-02 04:49:00', '2026-11-14 02:24:02'),
(50, 14, 'FKU-KEME14-M', 'M', 249000.00, 299000.00, 249000.00, 42, 0, 0, 0, 0, 14, 3, 0, '2026-11-02 04:49:00', '2026-11-14 02:24:02'),
(51, 14, 'FKU-KEME14-L', 'L', 249000.00, 299000.00, 249000.00, 11, 0, 0, 0, 0, 3, 3, 0, '2026-11-02 04:49:00', '2026-11-14 02:24:02'),
(52, 14, 'FKU-KEME14-XL', 'XL', 249000.00, 299000.00, 249000.00, 22, 0, 0, 0, 0, 7, 3, 0, '2026-11-02 04:49:00', '2026-11-14 02:24:02'),
(53, 15, 'FKU-KEME15-S', 'S', 349000.00, NULL, NULL, 22, 0, 0, 0, 0, 8, 3, 1, '2026-10-31 05:02:00', '2026-11-14 02:24:02'),
(54, 15, 'FKU-KEME15-M', 'M', 349000.00, NULL, NULL, 37, 0, 0, 0, 0, 12, 3, 0, '2026-10-31 05:02:00', '2026-11-14 02:24:02'),
(55, 15, 'FKU-KEME15-L', 'L', 349000.00, NULL, NULL, 6, 0, 0, 0, 0, 3, 3, 0, '2026-10-31 05:02:00', '2026-11-14 02:24:02'),
(56, 15, 'FKU-KEME15-XL', 'XL', 349000.00, NULL, NULL, 17, 0, 0, 0, 0, 5, 3, 0, '2026-10-31 05:02:00', '2026-11-14 02:24:02'),
(57, 16, 'FKU-KEME16-M', 'M', 279000.00, NULL, NULL, 21, 0, 0, 0, 0, 7, 3, 1, '2026-10-29 06:15:00', '2026-11-14 02:24:02'),
(58, 16, 'FKU-KEME16-L', 'L', 279000.00, NULL, NULL, 32, 0, 0, 0, 0, 10, 3, 0, '2026-10-29 06:15:00', '2026-11-14 02:24:02'),
(59, 16, 'FKU-KEME16-XL', 'XL', 279000.00, NULL, NULL, 43, 0, 0, 0, 0, 14, 3, 0, '2026-10-29 06:15:00', '2026-11-14 02:24:02'),
(60, 17, 'FKU-KEME17-S', 'S', 219000.00, 269000.00, 219000.00, 16, 0, 0, 0, 0, 5, 3, 1, '2026-10-27 07:28:00', '2026-11-14 02:24:02'),
(61, 17, 'FKU-KEME17-M', 'M', 219000.00, 269000.00, 219000.00, 23, 0, 0, 0, 0, 9, 3, 0, '2026-10-27 07:28:00', '2026-11-14 02:24:02'),
(62, 17, 'FKU-KEME17-L', 'L', 219000.00, 269000.00, 219000.00, 38, 0, 0, 0, 0, 12, 3, 0, '2026-10-27 07:28:00', '2026-11-14 02:24:02'),
(63, 18, 'FKU-KEME18-M', 'M', 249000.00, NULL, NULL, 11, 0, 0, 0, 0, 3, 3, 1, '2026-10-25 08:41:00', '2026-11-14 02:24:02'),
(64, 18, 'FKU-KEME18-L', 'L', 249000.00, NULL, NULL, 22, 0, 0, 0, 0, 7, 3, 0, '2026-10-25 08:41:00', '2026-11-14 02:24:02'),
(65, 18, 'FKU-KEME18-XL', 'XL', 249000.00, NULL, NULL, 33, 0, 0, 0, 0, 11, 3, 0, '2026-10-25 08:41:00', '2026-11-14 02:24:02'),
(66, 19, 'FKU-JAKE19-S', 'S', 329000.00, 399000.00, 329000.00, 1, 0, 0, 0, 0, 3, 3, 1, '2026-10-23 09:54:00', '2026-11-14 02:24:02'),
(67, 19, 'FKU-JAKE19-M', 'M', 329000.00, 399000.00, 329000.00, 17, 0, 0, 0, 0, 5, 3, 0, '2026-10-23 09:54:00', '2026-11-14 02:24:02'),
(68, 19, 'FKU-JAKE19-L', 'L', 329000.00, 399000.00, 329000.00, 28, 0, 0, 0, 0, 9, 3, 0, '2026-10-23 09:54:00', '2026-11-14 02:24:02'),
(69, 19, 'FKU-JAKE19-XL', 'XL', 329000.00, 399000.00, 329000.00, 39, 0, 0, 0, 0, 13, 3, 0, '2026-10-23 09:54:00', '2026-11-14 02:24:02'),
(70, 20, 'FKU-JAKE20-M', 'M', 549000.00, NULL, NULL, 43, 0, 0, 0, 0, 14, 3, 1, '2026-10-21 10:07:00', '2026-11-14 02:24:02'),
(71, 20, 'FKU-JAKE20-L', 'L', 549000.00, NULL, NULL, 12, 0, 0, 0, 0, 4, 3, 0, '2026-10-21 10:07:00', '2026-11-14 02:24:02'),
(72, 20, 'FKU-JAKE20-XL', 'XL', 549000.00, NULL, NULL, 23, 0, 0, 0, 0, 7, 3, 0, '2026-10-21 10:07:00', '2026-11-14 02:24:02'),
(73, 21, 'FKU-JAKE21-S', 'S', 459000.00, NULL, NULL, 36, 0, 0, 0, 0, 12, 3, 1, '2026-10-19 01:20:00', '2026-11-14 02:24:02'),
(74, 21, 'FKU-JAKE21-M', 'M', 459000.00, NULL, NULL, 0, 0, 0, 0, 0, 3, 3, 0, '2026-10-19 01:20:00', '2026-11-14 02:24:02'),
(75, 21, 'FKU-JAKE21-L', 'L', 459000.00, NULL, NULL, 18, 0, 0, 0, 0, 6, 3, 0, '2026-10-19 01:20:00', '2026-11-14 02:24:02'),
(76, 21, 'FKU-JAKE21-XL', 'XL', 459000.00, NULL, NULL, 29, 0, 0, 0, 0, 9, 3, 0, '2026-10-19 01:20:00', '2026-11-14 02:24:02'),
(77, 22, 'FKU-JAKE22-M', 'M', 499000.00, 599000.00, 499000.00, 31, 0, 0, 0, 0, 11, 3, 1, '2026-10-17 02:33:00', '2026-11-14 02:24:02'),
(78, 22, 'FKU-JAKE22-L', 'L', 499000.00, 599000.00, 499000.00, 44, 0, 0, 0, 0, 14, 3, 0, '2026-10-17 02:33:00', '2026-11-14 02:24:02'),
(79, 22, 'FKU-JAKE22-XL', 'XL', 499000.00, 599000.00, 499000.00, 7, 0, 0, 0, 0, 4, 3, 0, '2026-10-17 02:33:00', '2026-11-14 02:24:02'),
(80, 23, 'FKU-JAKE23-M', 'M', 429000.00, NULL, NULL, 24, 0, 0, 0, 0, 9, 3, 1, '2026-10-15 03:46:00', '2026-11-14 02:24:02'),
(81, 23, 'FKU-JAKE23-L', 'L', 429000.00, NULL, NULL, 39, 0, 0, 0, 0, 13, 3, 0, '2026-10-15 03:46:00', '2026-11-14 02:24:02'),
(82, 23, 'FKU-JAKE23-XL', 'XL', 429000.00, NULL, NULL, 4, 0, 0, 0, 0, 3, 3, 0, '2026-10-15 03:46:00', '2026-11-14 02:24:02'),
(83, 24, 'FKU-JAKE24-S', 'S', 319000.00, 379000.00, 319000.00, 18, 0, 0, 0, 0, 7, 3, 1, '2026-10-13 04:59:00', '2026-11-14 02:24:02'),
(84, 24, 'FKU-JAKE24-M', 'M', 319000.00, 379000.00, 319000.00, 34, 0, 0, 0, 0, 11, 3, 0, '2026-10-13 04:59:00', '2026-11-14 02:24:02'),
(85, 24, 'FKU-JAKE24-L', 'L', 319000.00, 379000.00, 319000.00, 45, 0, 0, 0, 0, 15, 3, 0, '2026-10-13 04:59:00', '2026-11-14 02:24:02'),
(86, 24, 'FKU-JAKE24-XL', 'XL', 319000.00, 379000.00, 319000.00, 14, 0, 0, 0, 0, 4, 3, 0, '2026-10-13 04:59:00', '2026-11-14 02:24:02'),
(87, 25, 'FKU-CELA25-28', '28', 199000.00, 239000.00, 199000.00, 16, 0, 0, 0, 0, 6, 3, 1, '2026-10-11 05:12:00', '2026-11-14 02:24:02'),
(88, 25, 'FKU-CELA25-29', '29', 199000.00, 239000.00, 199000.00, 29, 0, 0, 0, 0, 9, 3, 0, '2026-10-11 05:12:00', '2026-11-14 02:24:02'),
(89, 25, 'FKU-CELA25-30', '30', 199000.00, 239000.00, 199000.00, 40, 0, 0, 0, 0, 13, 3, 0, '2026-10-11 05:12:00', '2026-11-14 02:24:02'),
(90, 25, 'FKU-CELA25-31', '31', 199000.00, 239000.00, 199000.00, 9, 0, 0, 0, 0, 3, 3, 0, '2026-10-11 05:12:00', '2026-11-14 02:24:02'),
(91, 25, 'FKU-CELA25-32', '32', 199000.00, 239000.00, 199000.00, 20, 0, 0, 0, 0, 6, 3, 0, '2026-10-11 05:12:00', '2026-11-14 02:24:02'),
(92, 25, 'FKU-CELA25-33', '33', 199000.00, 239000.00, 199000.00, 27, 0, 0, 0, 0, 10, 3, 0, '2026-10-11 05:12:00', '2026-11-14 02:24:02'),
(93, 26, 'FKU-CELA26-29', '29', 329000.00, NULL, NULL, 10, 0, 0, 0, 0, 4, 3, 1, '2026-10-09 06:25:00', '2026-11-14 02:24:02'),
(94, 26, 'FKU-CELA26-30', '30', 329000.00, NULL, NULL, 24, 0, 0, 0, 0, 8, 3, 0, '2026-10-09 06:25:00', '2026-11-14 02:24:02'),
(95, 26, 'FKU-CELA26-31', '31', 329000.00, NULL, NULL, 35, 0, 0, 0, 0, 11, 3, 0, '2026-10-09 06:25:00', '2026-11-14 02:24:02'),
(96, 26, 'FKU-CELA26-32', '32', 329000.00, NULL, NULL, 46, 0, 0, 0, 0, 15, 3, 0, '2026-10-09 06:25:00', '2026-11-14 02:24:02'),
(97, 26, 'FKU-CELA26-33', '33', 329000.00, NULL, NULL, 15, 0, 0, 0, 0, 5, 3, 0, '2026-10-09 06:25:00', '2026-11-14 02:24:02'),
(98, 26, 'FKU-CELA26-34', '34', 329000.00, NULL, NULL, 26, 0, 0, 0, 0, 8, 3, 0, '2026-10-09 06:25:00', '2026-11-14 02:24:02'),
(99, 27, 'FKU-CELA27-30', '30', 299000.00, 359000.00, 299000.00, 8, 0, 0, 0, 0, 3, 3, 1, '2026-10-07 07:38:00', '2026-11-14 02:24:02'),
(100, 27, 'FKU-CELA27-31', '31', 299000.00, 359000.00, 299000.00, 14, 0, 0, 0, 0, 6, 3, 0, '2026-10-07 07:38:00', '2026-11-14 02:24:02'),
(101, 27, 'FKU-CELA27-32', '32', 299000.00, 359000.00, 299000.00, 30, 0, 0, 0, 0, 10, 3, 0, '2026-10-07 07:38:00', '2026-11-14 02:24:02'),
(102, 27, 'FKU-CELA27-33', '33', 299000.00, 359000.00, 299000.00, 41, 0, 0, 0, 0, 13, 3, 0, '2026-10-07 07:38:00', '2026-11-14 02:24:02'),
(103, 27, 'FKU-CELA27-34', '34', 299000.00, 359000.00, 299000.00, 10, 0, 0, 0, 0, 3, 3, 0, '2026-10-07 07:38:00', '2026-11-14 02:24:02'),
(104, 28, 'FKU-CELA28-29', '29', 459000.00, NULL, NULL, 45, 0, 0, 0, 0, 15, 3, 1, '2026-10-05 08:51:00', '2026-11-14 02:24:02'),
(105, 28, 'FKU-CELA28-30', '30', 459000.00, NULL, NULL, 9, 0, 0, 0, 0, 4, 3, 0, '2026-10-05 08:51:00', '2026-11-14 02:24:02'),
(106, 28, 'FKU-CELA28-31', '31', 459000.00, NULL, NULL, 25, 0, 0, 0, 0, 8, 3, 0, '2026-10-05 08:51:00', '2026-11-14 02:24:02'),
(107, 28, 'FKU-CELA28-32', '32', 459000.00, NULL, NULL, 36, 0, 0, 0, 0, 12, 3, 0, '2026-10-05 08:51:00', '2026-11-14 02:24:02'),
(108, 28, 'FKU-CELA28-33', '33', 459000.00, NULL, NULL, 47, 0, 0, 0, 0, 15, 3, 0, '2026-10-05 08:51:00', '2026-11-14 02:24:02'),
(109, 29, 'FKU-CELA29-M', 'M', 199000.00, NULL, NULL, 40, 0, 0, 0, 0, 13, 3, 1, '2026-10-03 09:04:00', '2026-10-03 09:04:00'),
(110, 29, 'FKU-CELA29-L', 'L', 199000.00, NULL, NULL, 9, 0, 0, 0, 0, 3, 3, 0, '2026-10-03 09:04:00', '2026-10-03 09:04:00'),
(111, 29, 'FKU-CELA29-XL', 'XL', 199000.00, NULL, NULL, 20, 0, 0, 0, 0, 6, 3, 0, '2026-10-03 09:04:00', '2026-10-03 09:04:00'),
(112, 30, 'FKU-CELA30-30', '30', 279000.00, NULL, NULL, 35, 0, 0, 0, 0, 11, 3, 1, '2026-10-01 10:17:00', '2026-11-14 02:24:02'),
(113, 30, 'FKU-CELA30-31', '31', 279000.00, NULL, NULL, 46, 0, 0, 0, 0, 15, 3, 0, '2026-10-01 10:17:00', '2026-11-14 02:24:02'),
(114, 30, 'FKU-CELA30-32', '32', 279000.00, NULL, NULL, 15, 0, 0, 0, 0, 5, 3, 0, '2026-10-01 10:17:00', '2026-11-14 02:24:02'),
(115, 30, 'FKU-CELA30-33', '33', 279000.00, NULL, NULL, 26, 0, 0, 0, 0, 8, 3, 0, '2026-10-01 10:17:00', '2026-11-14 02:24:02'),
(116, 30, 'FKU-CELA30-34', '34', 279000.00, NULL, NULL, 27, 0, 0, 0, 0, 12, 3, 0, '2026-10-01 10:17:00', '2026-11-14 02:24:02'),
(117, 31, 'FKU-CELA31-29', '29', 289000.00, 349000.00, 289000.00, 30, 0, 0, 0, 0, 10, 3, 1, '2026-09-29 01:30:00', '2026-11-14 02:24:02'),
(118, 31, 'FKU-CELA31-30', '30', 289000.00, 349000.00, 289000.00, 41, 0, 0, 0, 0, 13, 3, 0, '2026-09-29 01:30:00', '2026-11-14 02:24:02'),
(119, 31, 'FKU-CELA31-31', '31', 289000.00, 349000.00, 289000.00, 10, 0, 0, 0, 0, 3, 3, 0, '2026-09-29 01:30:00', '2026-11-14 02:24:02'),
(120, 31, 'FKU-CELA31-32', '32', 289000.00, 349000.00, 289000.00, 21, 0, 0, 0, 0, 7, 3, 0, '2026-09-29 01:30:00', '2026-11-14 02:24:02'),
(121, 31, 'FKU-CELA31-33', '33', 289000.00, 349000.00, 289000.00, 24, 0, 0, 0, 0, 10, 3, 0, '2026-09-29 01:30:00', '2026-11-14 02:24:02'),
(122, 31, 'FKU-CELA31-34', '34', 289000.00, 349000.00, 289000.00, 43, 0, 0, 0, 0, 14, 3, 0, '2026-09-29 01:30:00', '2026-11-14 02:24:02'),
(123, 32, 'FKU-DRES32-S', 'S', 279000.00, 329000.00, 279000.00, 24, 0, 0, 0, 0, 8, 3, 1, '2026-09-27 02:43:00', '2026-11-14 02:24:02'),
(124, 32, 'FKU-DRES32-M', 'M', 279000.00, 329000.00, 279000.00, 31, 0, 0, 0, 0, 12, 3, 0, '2026-09-27 02:43:00', '2026-11-14 02:24:02'),
(125, 32, 'FKU-DRES32-L', 'L', 279000.00, 329000.00, 279000.00, 47, 0, 0, 0, 0, 15, 3, 0, '2026-09-27 02:43:00', '2026-11-14 02:24:02'),
(126, 32, 'FKU-DRES32-XL', 'XL', 279000.00, 329000.00, 279000.00, 16, 0, 0, 0, 0, 5, 3, 0, '2026-09-27 02:43:00', '2026-11-14 02:24:02'),
(127, 33, 'FKU-DRES33-S', 'S', 289000.00, NULL, NULL, 19, 0, 0, 0, 0, 6, 3, 1, '2026-09-25 03:56:00', '2026-11-14 02:24:02'),
(128, 33, 'FKU-DRES33-M', 'M', 289000.00, NULL, NULL, 31, 0, 0, 0, 0, 10, 3, 0, '2026-09-25 03:56:00', '2026-11-14 02:24:02'),
(129, 33, 'FKU-DRES33-L', 'L', 289000.00, NULL, NULL, 42, 0, 0, 0, 0, 14, 3, 0, '2026-09-25 03:56:00', '2026-11-14 02:24:02'),
(130, 34, 'FKU-DRES34-S', 'S', 299000.00, NULL, NULL, 15, 0, 0, 0, 0, 5, 3, 1, '2026-09-23 04:09:00', '2026-11-14 02:24:02'),
(131, 34, 'FKU-DRES34-M', 'M', 299000.00, NULL, NULL, 26, 0, 0, 0, 0, 8, 3, 0, '2026-09-23 04:09:00', '2026-11-14 02:24:02'),
(132, 34, 'FKU-DRES34-L', 'L', 299000.00, NULL, NULL, 37, 0, 0, 0, 0, 12, 3, 0, '2026-09-23 04:09:00', '2026-11-14 02:24:02'),
(133, 34, 'FKU-DRES34-XL', 'XL', 299000.00, NULL, NULL, 6, 0, 0, 0, 0, 3, 3, 0, '2026-09-23 04:09:00', '2026-11-14 02:24:02'),
(134, 35, 'FKU-DRES35-M', 'M', 349000.00, NULL, NULL, 1, 0, 0, 0, 0, 3, 3, 1, '2026-09-21 05:22:00', '2026-11-14 02:24:02'),
(135, 35, 'FKU-DRES35-L', 'L', 349000.00, NULL, NULL, 21, 0, 0, 0, 0, 7, 3, 0, '2026-09-21 05:22:00', '2026-11-14 02:24:02'),
(136, 35, 'FKU-DRES35-XL', 'XL', 349000.00, NULL, NULL, 32, 0, 0, 0, 0, 10, 3, 0, '2026-09-21 05:22:00', '2026-11-14 02:24:02'),
(137, 36, 'FKU-DRES36-S', 'S', 359000.00, 429000.00, 359000.00, 43, 0, 0, 0, 0, 15, 3, 1, '2026-09-19 06:35:00', '2026-11-14 02:24:02'),
(138, 36, 'FKU-DRES36-M', 'M', 359000.00, 429000.00, 359000.00, 16, 0, 0, 0, 0, 5, 3, 0, '2026-09-19 06:35:00', '2026-11-14 02:24:02'),
(139, 36, 'FKU-DRES36-L', 'L', 359000.00, 429000.00, 359000.00, 27, 0, 0, 0, 0, 9, 3, 0, '2026-09-19 06:35:00', '2026-11-14 02:24:02'),
(140, 36, 'FKU-DRES36-XL', 'XL', 359000.00, 429000.00, 359000.00, 38, 0, 0, 0, 0, 12, 3, 0, '2026-09-19 06:35:00', '2026-11-14 02:24:02'),
(141, 37, 'FKU-DRES37-S', 'S', 259000.00, NULL, NULL, 42, 0, 0, 0, 0, 14, 3, 1, '2026-09-17 07:48:00', '2026-09-17 07:48:00'),
(142, 37, 'FKU-DRES37-M', 'M', 259000.00, NULL, NULL, 11, 0, 0, 0, 0, 3, 3, 0, '2026-09-17 07:48:00', '2026-09-17 07:48:00'),
(143, 37, 'FKU-DRES37-L', 'L', 259000.00, NULL, NULL, 22, 0, 0, 0, 0, 7, 3, 0, '2026-09-17 07:48:00', '2026-09-17 07:48:00'),
(144, 38, 'FKU-DRES38-S', 'S', 199000.00, 239000.00, 199000.00, 26, 0, 0, 0, 0, 12, 3, 1, '2026-09-15 08:01:00', '2026-11-14 02:24:02'),
(145, 38, 'FKU-DRES38-M', 'M', 199000.00, 239000.00, 199000.00, 1, 0, 0, 0, 0, 3, 3, 0, '2026-09-15 08:01:00', '2026-11-14 02:24:02'),
(146, 38, 'FKU-DRES38-L', 'L', 199000.00, 239000.00, 199000.00, 17, 0, 0, 0, 0, 5, 3, 0, '2026-09-15 08:01:00', '2026-11-14 02:24:02'),
(147, 39, 'FKU-DRES39-S', 'S', 319000.00, NULL, NULL, 30, 0, 0, 0, 0, 10, 3, 1, '2026-09-13 09:14:00', '2026-11-14 02:24:02'),
(148, 39, 'FKU-DRES39-M', 'M', 319000.00, NULL, NULL, 43, 0, 0, 0, 0, 14, 3, 0, '2026-09-13 09:14:00', '2026-11-14 02:24:02'),
(149, 39, 'FKU-DRES39-L', 'L', 319000.00, NULL, NULL, 12, 0, 0, 0, 0, 4, 3, 0, '2026-09-13 09:14:00', '2026-11-14 02:24:02'),
(150, 39, 'FKU-DRES39-XL', 'XL', 319000.00, NULL, NULL, 18, 0, 0, 0, 0, 7, 3, 0, '2026-09-13 09:14:00', '2026-11-14 02:24:02'),
(151, 40, 'FKU-DRES40-S', 'S', 259000.00, 309000.00, 259000.00, 24, 0, 0, 0, 0, 9, 3, 1, '2026-09-11 10:27:00', '2026-11-14 02:24:02'),
(152, 40, 'FKU-DRES40-M', 'M', 259000.00, 309000.00, 259000.00, 38, 0, 0, 0, 0, 12, 3, 0, '2026-09-11 10:27:00', '2026-11-14 02:24:02'),
(153, 40, 'FKU-DRES40-L', 'L', 259000.00, 309000.00, 259000.00, 7, 0, 0, 0, 0, 3, 3, 0, '2026-09-11 10:27:00', '2026-11-14 02:24:02'),
(154, 41, 'FKU-BLUS41-S', 'S', 209000.00, 249000.00, 209000.00, 19, 0, 0, 0, 0, 7, 3, 1, '2026-09-09 01:40:00', '2026-11-14 02:24:02'),
(155, 41, 'FKU-BLUS41-M', 'M', 209000.00, 249000.00, 209000.00, 33, 0, 0, 0, 0, 11, 3, 0, '2026-09-09 01:40:00', '2026-11-14 02:24:02'),
(156, 41, 'FKU-BLUS41-L', 'L', 209000.00, 249000.00, 209000.00, 44, 0, 0, 0, 0, 14, 3, 0, '2026-09-09 01:40:00', '2026-11-14 02:24:02'),
(157, 41, 'FKU-BLUS41-XL', 'XL', 209000.00, 249000.00, 209000.00, 13, 0, 0, 0, 0, 4, 3, 0, '2026-09-09 01:40:00', '2026-11-14 02:24:02'),
(158, 42, 'FKU-BLUS42-S', 'S', 219000.00, NULL, NULL, 4, 0, 0, 0, 0, 5, 3, 1, '2026-09-07 02:53:00', '2026-11-14 02:24:02'),
(159, 42, 'FKU-BLUS42-M', 'M', 219000.00, NULL, NULL, 28, 0, 0, 0, 0, 9, 3, 0, '2026-09-07 02:53:00', '2026-11-14 02:24:02'),
(160, 42, 'FKU-BLUS42-L', 'L', 219000.00, NULL, NULL, 39, 0, 0, 0, 0, 13, 3, 0, '2026-09-07 02:53:00', '2026-11-14 02:24:02'),
(161, 42, 'FKU-BLUS42-XL', 'XL', 219000.00, NULL, NULL, 8, 0, 0, 0, 0, 3, 3, 0, '2026-09-07 02:53:00', '2026-11-14 02:24:02'),
(162, 43, 'FKU-BLUS43-S', 'S', 229000.00, NULL, NULL, 12, 0, 0, 0, 0, 4, 3, 1, '2026-09-05 03:06:00', '2026-11-14 02:24:02'),
(163, 43, 'FKU-BLUS43-M', 'M', 229000.00, NULL, NULL, 15, 0, 0, 0, 0, 7, 3, 0, '2026-09-05 03:06:00', '2026-11-14 02:24:02'),
(164, 43, 'FKU-BLUS43-L', 'L', 229000.00, NULL, NULL, 34, 0, 0, 0, 0, 11, 3, 0, '2026-09-05 03:06:00', '2026-11-14 02:24:02'),
(165, 43, 'FKU-BLUS43-XL', 'XL', 229000.00, NULL, NULL, 45, 0, 0, 0, 0, 15, 3, 0, '2026-09-05 03:06:00', '2026-11-14 02:24:02'),
(166, 44, 'FKU-BLUS44-S', 'S', 139000.00, 169000.00, 139000.00, 1, 0, 0, 0, 0, 3, 3, 1, '2026-09-03 04:19:00', '2026-11-14 02:24:02'),
(167, 44, 'FKU-BLUS44-M', 'M', 139000.00, 169000.00, 139000.00, 18, 0, 0, 0, 0, 6, 3, 0, '2026-09-03 04:19:00', '2026-11-14 02:24:02'),
(168, 44, 'FKU-BLUS44-L', 'L', 139000.00, 169000.00, 139000.00, 29, 0, 0, 0, 0, 9, 3, 0, '2026-09-03 04:19:00', '2026-11-14 02:24:02'),
(169, 45, 'FKU-BLUS45-S', 'S', 209000.00, NULL, NULL, 44, 0, 0, 0, 0, 14, 3, 1, '2026-09-01 05:32:00', '2026-11-14 02:24:02'),
(170, 45, 'FKU-BLUS45-M', 'M', 209000.00, NULL, NULL, 13, 0, 0, 0, 0, 4, 3, 0, '2026-09-01 05:32:00', '2026-11-14 02:24:02'),
(171, 45, 'FKU-BLUS45-L', 'L', 209000.00, NULL, NULL, 24, 0, 0, 0, 0, 8, 3, 0, '2026-09-01 05:32:00', '2026-11-14 02:24:02'),
(172, 46, 'FKU-BLUS46-S', 'S', 239000.00, 279000.00, 239000.00, 39, 0, 0, 0, 0, 13, 3, 1, '2026-08-30 06:45:00', '2026-11-14 02:24:02'),
(173, 46, 'FKU-BLUS46-M', 'M', 239000.00, 279000.00, 239000.00, 8, 0, 0, 0, 0, 3, 3, 0, '2026-08-30 06:45:00', '2026-11-14 02:24:02'),
(174, 46, 'FKU-BLUS46-L', 'L', 239000.00, 279000.00, 239000.00, 19, 0, 0, 0, 0, 6, 3, 0, '2026-08-30 06:45:00', '2026-11-14 02:24:02'),
(175, 46, 'FKU-BLUS46-XL', 'XL', 239000.00, 279000.00, 239000.00, 30, 0, 0, 0, 0, 10, 3, 0, '2026-08-30 06:45:00', '2026-11-14 02:24:02'),
(176, 47, 'FKU-BLUS47-S', 'S', 189000.00, NULL, NULL, 29, 0, 0, 0, 0, 11, 3, 1, '2026-08-28 07:58:00', '2026-11-14 02:24:02'),
(177, 47, 'FKU-BLUS47-M', 'M', 189000.00, NULL, NULL, 45, 0, 0, 0, 0, 15, 3, 0, '2026-08-28 07:58:00', '2026-11-14 02:24:02'),
(178, 47, 'FKU-BLUS47-L', 'L', 189000.00, NULL, NULL, 14, 0, 0, 0, 0, 4, 3, 0, '2026-08-28 07:58:00', '2026-11-14 02:24:02'),
(179, 48, 'FKU-BLUS48-S', 'S', 269000.00, NULL, NULL, 29, 0, 0, 0, 0, 9, 3, 1, '2026-08-26 08:11:00', '2026-11-14 02:24:02'),
(180, 48, 'FKU-BLUS48-M', 'M', 269000.00, NULL, NULL, 40, 0, 0, 0, 0, 13, 3, 0, '2026-08-26 08:11:00', '2026-11-14 02:24:02'),
(181, 48, 'FKU-BLUS48-L', 'L', 269000.00, NULL, NULL, 9, 0, 0, 0, 0, 3, 3, 0, '2026-08-26 08:11:00', '2026-11-14 02:24:02'),
(182, 48, 'FKU-BLUS48-XL', 'XL', 269000.00, NULL, NULL, 20, 0, 0, 0, 0, 6, 3, 0, '2026-08-26 08:11:00', '2026-11-14 02:24:02'),
(183, 49, 'FKU-ROK49-S', 'S', 189000.00, 229000.00, 189000.00, 24, 0, 0, 0, 0, 8, 3, 1, '2026-08-24 09:24:00', '2026-11-14 02:24:02'),
(184, 49, 'FKU-ROK49-M', 'M', 189000.00, 229000.00, 189000.00, 29, 0, 0, 0, 0, 11, 3, 0, '2026-08-24 09:24:00', '2026-11-14 02:24:02'),
(185, 49, 'FKU-ROK49-L', 'L', 189000.00, 229000.00, 189000.00, 46, 0, 0, 0, 0, 15, 3, 0, '2026-08-24 09:24:00', '2026-11-14 02:24:02'),
(186, 49, 'FKU-ROK49-XL', 'XL', 189000.00, 229000.00, 189000.00, 15, 0, 0, 0, 0, 5, 3, 0, '2026-08-24 09:24:00', '2026-11-14 02:24:02'),
(187, 50, 'FKU-ROK50-S', 'S', 269000.00, NULL, NULL, 19, 0, 0, 0, 0, 6, 3, 1, '2026-08-22 10:37:00', '2026-11-14 02:24:02'),
(188, 50, 'FKU-ROK50-M', 'M', 269000.00, NULL, NULL, 30, 0, 0, 0, 0, 10, 3, 0, '2026-08-22 10:37:00', '2026-11-14 02:24:02'),
(189, 50, 'FKU-ROK50-L', 'L', 269000.00, NULL, NULL, 36, 0, 0, 0, 0, 13, 3, 0, '2026-08-22 10:37:00', '2026-11-14 02:24:02'),
(190, 50, 'FKU-ROK50-XL', 'XL', 269000.00, NULL, NULL, 10, 0, 0, 0, 0, 3, 3, 0, '2026-08-22 10:37:00', '2026-11-14 02:24:02'),
(191, 51, 'FKU-ROK51-S', 'S', 199000.00, NULL, NULL, 14, 0, 0, 0, 0, 4, 3, 1, '2026-08-20 01:50:00', '2026-11-14 02:24:02'),
(192, 51, 'FKU-ROK51-M', 'M', 199000.00, NULL, NULL, 25, 0, 0, 0, 0, 8, 3, 0, '2026-08-20 01:50:00', '2026-11-14 02:24:02'),
(193, 51, 'FKU-ROK51-L', 'L', 199000.00, NULL, NULL, 36, 0, 0, 0, 0, 12, 3, 0, '2026-08-20 01:50:00', '2026-11-14 02:24:02'),
(194, 52, 'FKU-ROK52-S', 'S', 239000.00, 279000.00, 239000.00, 9, 0, 0, 0, 0, 3, 3, 1, '2026-08-18 02:03:00', '2026-11-14 02:24:02'),
(195, 52, 'FKU-ROK52-M', 'M', 239000.00, 279000.00, 239000.00, 20, 0, 0, 0, 0, 6, 3, 0, '2026-08-18 02:03:00', '2026-11-14 02:24:02'),
(196, 52, 'FKU-ROK52-L', 'L', 239000.00, 279000.00, 239000.00, 31, 0, 0, 0, 0, 10, 3, 0, '2026-08-18 02:03:00', '2026-11-14 02:24:02'),
(197, 52, 'FKU-ROK52-XL', 'XL', 239000.00, 279000.00, 239000.00, 30, 0, 0, 0, 0, 14, 3, 0, '2026-08-18 02:03:00', '2026-11-14 02:24:02'),
(198, 53, 'FKU-ROK53-S', 'S', 259000.00, NULL, NULL, 46, 0, 0, 0, 0, 15, 3, 1, '2026-08-16 03:16:00', '2026-11-14 02:24:02'),
(199, 53, 'FKU-ROK53-M', 'M', 259000.00, NULL, NULL, 15, 0, 0, 0, 0, 5, 3, 0, '2026-08-16 03:16:00', '2026-11-14 02:24:02'),
(200, 53, 'FKU-ROK53-L', 'L', 259000.00, NULL, NULL, 26, 0, 0, 0, 0, 8, 3, 0, '2026-08-16 03:16:00', '2026-11-14 02:24:02'),
(201, 53, 'FKU-ROK53-XL', 'XL', 259000.00, NULL, NULL, 37, 0, 0, 0, 0, 12, 3, 0, '2026-08-16 03:16:00', '2026-11-14 02:24:02'),
(202, 54, 'FKU-OUTE54-S', 'S', 359000.00, 429000.00, 359000.00, 31, 0, 0, 0, 0, 13, 3, 1, '2026-08-14 04:29:00', '2026-11-14 02:24:02'),
(203, 54, 'FKU-OUTE54-M', 'M', 359000.00, 429000.00, 359000.00, 10, 0, 0, 0, 0, 3, 3, 0, '2026-08-14 04:29:00', '2026-11-14 02:24:02'),
(204, 54, 'FKU-OUTE54-L', 'L', 359000.00, 429000.00, 359000.00, 21, 0, 0, 0, 0, 7, 3, 0, '2026-08-14 04:29:00', '2026-11-14 02:24:02'),
(205, 54, 'FKU-OUTE54-XL', 'XL', 359000.00, 429000.00, 359000.00, 26, 0, 0, 0, 0, 10, 3, 0, '2026-08-14 04:29:00', '2026-11-14 02:24:02'),
(206, 55, 'FKU-OUTE55-S', 'S', 299000.00, NULL, NULL, 36, 0, 0, 0, 0, 12, 3, 1, '2026-08-12 05:42:00', '2026-11-14 02:24:02'),
(207, 55, 'FKU-OUTE55-M', 'M', 299000.00, NULL, NULL, 47, 0, 0, 0, 0, 15, 3, 0, '2026-08-12 05:42:00', '2026-11-14 02:24:02'),
(208, 55, 'FKU-OUTE55-L', 'L', 299000.00, NULL, NULL, 16, 0, 0, 0, 0, 5, 3, 0, '2026-08-12 05:42:00', '2026-11-14 02:24:02'),
(209, 56, 'FKU-OUTE56-S', 'S', 549000.00, 649000.00, 549000.00, 31, 0, 0, 0, 0, 10, 3, 1, '2026-08-10 06:55:00', '2026-11-14 02:24:02'),
(210, 56, 'FKU-OUTE56-M', 'M', 549000.00, 649000.00, 549000.00, 42, 0, 0, 0, 0, 14, 3, 0, '2026-08-10 06:55:00', '2026-11-14 02:24:02'),
(211, 56, 'FKU-OUTE56-L', 'L', 549000.00, 649000.00, 549000.00, 11, 0, 0, 0, 0, 3, 3, 0, '2026-08-10 06:55:00', '2026-11-14 02:24:02'),
(212, 56, 'FKU-OUTE56-XL', 'XL', 549000.00, 649000.00, 549000.00, 22, 0, 0, 0, 0, 7, 3, 0, '2026-08-10 06:55:00', '2026-11-14 02:24:02'),
(213, 57, 'FKU-OUTE57-S', 'S', 379000.00, NULL, NULL, 26, 0, 0, 0, 0, 8, 3, 1, '2026-08-08 07:08:00', '2026-11-14 02:24:02'),
(214, 57, 'FKU-OUTE57-M', 'M', 379000.00, NULL, NULL, 37, 0, 0, 0, 0, 12, 3, 0, '2026-08-08 07:08:00', '2026-11-14 02:24:02'),
(215, 57, 'FKU-OUTE57-L', 'L', 379000.00, NULL, NULL, 1, 0, 0, 0, 0, 3, 3, 0, '2026-08-08 07:08:00', '2026-11-14 02:24:02'),
(216, 58, 'FKU-OUTE58-S', 'S', 279000.00, 329000.00, 279000.00, 21, 0, 0, 0, 0, 7, 3, 1, '2026-08-06 08:21:00', '2026-08-06 08:21:00'),
(217, 58, 'FKU-OUTE58-M', 'M', 279000.00, 329000.00, 279000.00, 32, 0, 0, 0, 0, 10, 3, 0, '2026-08-06 08:21:00', '2026-08-06 08:21:00'),
(218, 58, 'FKU-OUTE58-L', 'L', 279000.00, 329000.00, 279000.00, 43, 0, 0, 0, 0, 14, 3, 0, '2026-08-06 08:21:00', '2026-08-06 08:21:00'),
(219, 58, 'FKU-OUTE58-XL', 'XL', 279000.00, 329000.00, 279000.00, 12, 0, 0, 0, 0, 4, 3, 0, '2026-08-06 08:21:00', '2026-08-06 08:21:00'),
(220, 59, 'FKU-SEPA59-39', '39', 249000.00, 299000.00, 249000.00, 16, 0, 0, 0, 0, 5, 3, 1, '2026-08-04 09:34:00', '2026-11-14 02:24:02'),
(221, 59, 'FKU-SEPA59-40', '40', 249000.00, 299000.00, 249000.00, 27, 0, 0, 0, 0, 9, 3, 0, '2026-08-04 09:34:00', '2026-11-14 02:24:02'),
(222, 59, 'FKU-SEPA59-41', '41', 249000.00, 299000.00, 249000.00, 38, 0, 0, 0, 0, 12, 3, 0, '2026-08-04 09:34:00', '2026-11-14 02:24:02'),
(223, 59, 'FKU-SEPA59-42', '42', 249000.00, 299000.00, 249000.00, 7, 0, 0, 0, 0, 3, 3, 0, '2026-08-04 09:34:00', '2026-11-14 02:24:02'),
(224, 59, 'FKU-SEPA59-43', '43', 249000.00, 299000.00, 249000.00, 18, 0, 0, 0, 0, 6, 3, 0, '2026-08-04 09:34:00', '2026-11-14 02:24:02'),
(225, 59, 'FKU-SEPA59-44', '44', 249000.00, 299000.00, 249000.00, 29, 0, 0, 0, 0, 9, 3, 0, '2026-08-04 09:34:00', '2026-11-14 02:24:02'),
(226, 60, 'FKU-SEPA60-39', '39', 449000.00, NULL, NULL, 11, 0, 0, 0, 0, 3, 3, 1, '2026-08-02 10:47:00', '2026-11-14 02:24:02'),
(227, 60, 'FKU-SEPA60-40', '40', 449000.00, NULL, NULL, 17, 0, 0, 0, 0, 7, 3, 0, '2026-08-02 10:47:00', '2026-11-14 02:24:02'),
(228, 60, 'FKU-SEPA60-41', '41', 449000.00, NULL, NULL, 33, 0, 0, 0, 0, 11, 3, 0, '2026-08-02 10:47:00', '2026-11-14 02:24:02'),
(229, 60, 'FKU-SEPA60-42', '42', 449000.00, NULL, NULL, 44, 0, 0, 0, 0, 14, 3, 0, '2026-08-02 10:47:00', '2026-11-14 02:24:02'),
(230, 60, 'FKU-SEPA60-43', '43', 449000.00, NULL, NULL, 13, 0, 0, 0, 0, 4, 3, 0, '2026-08-02 10:47:00', '2026-11-14 02:24:02'),
(231, 61, 'FKU-SEPA61-40', '40', 649000.00, 749000.00, 649000.00, 6, 0, 0, 0, 0, 3, 3, 1, '2026-07-31 01:00:00', '2026-11-14 02:24:02'),
(232, 61, 'FKU-SEPA61-41', '41', 649000.00, 749000.00, 649000.00, 12, 0, 0, 0, 0, 5, 3, 0, '2026-07-31 01:00:00', '2026-11-14 02:24:02'),
(233, 61, 'FKU-SEPA61-42', '42', 649000.00, 749000.00, 649000.00, 28, 0, 0, 0, 0, 9, 3, 0, '2026-07-31 01:00:00', '2026-11-14 02:24:02'),
(234, 61, 'FKU-SEPA61-43', '43', 649000.00, 749000.00, 649000.00, 39, 0, 0, 0, 0, 13, 3, 0, '2026-07-31 01:00:00', '2026-11-14 02:24:02'),
(235, 61, 'FKU-SEPA61-44', '44', 649000.00, 749000.00, 649000.00, 8, 0, 0, 0, 0, 3, 3, 0, '2026-07-31 01:00:00', '2026-11-14 02:24:02'),
(236, 62, 'FKU-SEPA62-39', '39', 379000.00, NULL, NULL, 43, 0, 0, 0, 0, 14, 3, 1, '2026-07-29 02:13:00', '2026-11-14 02:24:02'),
(237, 62, 'FKU-SEPA62-40', '40', 379000.00, NULL, NULL, 12, 0, 0, 0, 0, 4, 3, 0, '2026-07-29 02:13:00', '2026-11-14 02:24:02'),
(238, 62, 'FKU-SEPA62-41', '41', 379000.00, NULL, NULL, 23, 0, 0, 0, 0, 7, 3, 0, '2026-07-29 02:13:00', '2026-11-14 02:24:02'),
(239, 62, 'FKU-SEPA62-42', '42', 379000.00, NULL, NULL, 34, 0, 0, 0, 0, 11, 3, 0, '2026-07-29 02:13:00', '2026-11-14 02:24:02'),
(240, 62, 'FKU-SEPA62-43', '43', 379000.00, NULL, NULL, 35, 0, 0, 0, 0, 15, 3, 0, '2026-07-29 02:13:00', '2026-11-14 02:24:02'),
(241, 63, 'FKU-SEPA63-40', '40', 649000.00, NULL, NULL, 38, 0, 0, 0, 0, 12, 3, 1, '2026-07-27 03:26:00', '2026-11-14 02:24:02'),
(242, 63, 'FKU-SEPA63-41', '41', 649000.00, NULL, NULL, 7, 0, 0, 0, 0, 3, 3, 0, '2026-07-27 03:26:00', '2026-11-14 02:24:02'),
(243, 63, 'FKU-SEPA63-42', '42', 649000.00, NULL, NULL, 18, 0, 0, 0, 0, 6, 3, 0, '2026-07-27 03:26:00', '2026-11-14 02:24:02'),
(244, 63, 'FKU-SEPA63-43', '43', 649000.00, NULL, NULL, 29, 0, 0, 0, 0, 9, 3, 0, '2026-07-27 03:26:00', '2026-11-14 02:24:02'),
(245, 63, 'FKU-SEPA63-44', '44', 649000.00, NULL, NULL, 30, 0, 0, 0, 0, 13, 3, 0, '2026-07-27 03:26:00', '2026-11-14 02:24:02'),
(246, 64, 'FKU-SEPA64-40', '40', 499000.00, 599000.00, 499000.00, 33, 0, 0, 0, 0, 11, 3, 1, '2026-07-25 04:39:00', '2026-11-14 02:24:02'),
(247, 64, 'FKU-SEPA64-41', '41', 499000.00, 599000.00, 499000.00, 44, 0, 0, 0, 0, 14, 3, 0, '2026-07-25 04:39:00', '2026-11-14 02:24:02'),
(248, 64, 'FKU-SEPA64-42', '42', 499000.00, 599000.00, 499000.00, 7, 0, 0, 0, 0, 4, 3, 0, '2026-07-25 04:39:00', '2026-11-14 02:24:02'),
(249, 64, 'FKU-SEPA64-43', '43', 499000.00, 599000.00, 499000.00, 24, 0, 0, 0, 0, 8, 3, 0, '2026-07-25 04:39:00', '2026-11-14 02:24:02'),
(250, 64, 'FKU-SEPA64-44', '44', 499000.00, 599000.00, 499000.00, 35, 0, 0, 0, 0, 11, 3, 0, '2026-07-25 04:39:00', '2026-11-14 02:24:02'),
(251, 65, 'FKU-SEPA65-40', '40', 899000.00, NULL, NULL, 28, 0, 0, 0, 0, 9, 3, 1, '2026-07-23 05:52:00', '2026-11-14 02:24:02'),
(252, 65, 'FKU-SEPA65-41', '41', 899000.00, NULL, NULL, 39, 0, 0, 0, 0, 13, 3, 0, '2026-07-23 05:52:00', '2026-11-14 02:24:02'),
(253, 65, 'FKU-SEPA65-42', '42', 899000.00, NULL, NULL, 8, 0, 0, 0, 0, 3, 3, 0, '2026-07-23 05:52:00', '2026-11-14 02:24:02'),
(254, 65, 'FKU-SEPA65-43', '43', 899000.00, NULL, NULL, 19, 0, 0, 0, 0, 6, 3, 0, '2026-07-23 05:52:00', '2026-11-14 02:24:02'),
(255, 65, 'FKU-SEPA65-44', '44', 899000.00, NULL, NULL, 30, 0, 0, 0, 0, 10, 3, 0, '2026-07-23 05:52:00', '2026-11-14 02:24:02'),
(256, 66, 'FKU-SEPA66-40', '40', 459000.00, 549000.00, 459000.00, 23, 0, 0, 0, 0, 7, 3, 1, '2026-07-21 06:05:00', '2026-11-14 02:24:02'),
(257, 66, 'FKU-SEPA66-41', '41', 459000.00, 549000.00, 459000.00, 34, 0, 0, 0, 0, 11, 3, 0, '2026-07-21 06:05:00', '2026-11-14 02:24:02'),
(258, 66, 'FKU-SEPA66-42', '42', 459000.00, 549000.00, 459000.00, 40, 0, 0, 0, 0, 15, 3, 0, '2026-07-21 06:05:00', '2026-11-14 02:24:02'),
(259, 66, 'FKU-SEPA66-43', '43', 459000.00, 549000.00, 459000.00, 14, 0, 0, 0, 0, 4, 3, 0, '2026-07-21 06:05:00', '2026-11-14 02:24:02'),
(260, 66, 'FKU-SEPA66-44', '44', 459000.00, 549000.00, 459000.00, 25, 0, 0, 0, 0, 8, 3, 0, '2026-07-21 06:05:00', '2026-11-14 02:24:02'),
(261, 67, 'FKU-SEPA67-37', '37', 359000.00, NULL, NULL, 18, 0, 0, 0, 0, 6, 3, 1, '2026-07-19 07:18:00', '2026-11-14 02:24:02'),
(262, 67, 'FKU-SEPA67-38', '38', 359000.00, NULL, NULL, 29, 0, 0, 0, 0, 9, 3, 0, '2026-07-19 07:18:00', '2026-11-14 02:24:02'),
(263, 67, 'FKU-SEPA67-39', '39', 359000.00, NULL, NULL, 40, 0, 0, 0, 0, 13, 3, 0, '2026-07-19 07:18:00', '2026-11-14 02:24:02'),
(264, 67, 'FKU-SEPA67-40', '40', 359000.00, NULL, NULL, 9, 0, 0, 0, 0, 3, 3, 0, '2026-07-19 07:18:00', '2026-11-14 02:24:02'),
(265, 67, 'FKU-SEPA67-41', '41', 359000.00, NULL, NULL, 20, 0, 0, 0, 0, 6, 3, 0, '2026-07-19 07:18:00', '2026-11-14 02:24:02'),
(266, 68, 'FKU-SEPA68-36', '36', 329000.00, 399000.00, 329000.00, 8, 0, 0, 0, 0, 4, 3, 1, '2026-07-17 08:31:00', '2026-11-14 02:24:02'),
(267, 68, 'FKU-SEPA68-37', '37', 329000.00, 399000.00, 329000.00, 24, 0, 0, 0, 0, 8, 3, 0, '2026-07-17 08:31:00', '2026-11-14 02:24:02'),
(268, 68, 'FKU-SEPA68-38', '38', 329000.00, 399000.00, 329000.00, 35, 0, 0, 0, 0, 11, 3, 0, '2026-07-17 08:31:00', '2026-11-14 02:24:02'),
(269, 68, 'FKU-SEPA68-39', '39', 329000.00, 399000.00, 329000.00, 46, 0, 0, 0, 0, 15, 3, 0, '2026-07-17 08:31:00', '2026-11-14 02:24:02'),
(270, 68, 'FKU-SEPA68-40', '40', 329000.00, 399000.00, 329000.00, 15, 0, 0, 0, 0, 5, 3, 0, '2026-07-17 08:31:00', '2026-11-14 02:24:02'),
(271, 69, 'FKU-SEPA69-39', '39', 329000.00, NULL, NULL, 3, 0, 0, 0, 0, 3, 3, 1, '2026-07-15 09:44:00', '2026-11-14 02:24:02'),
(272, 69, 'FKU-SEPA69-40', '40', 329000.00, NULL, NULL, 19, 0, 0, 0, 0, 6, 3, 0, '2026-07-15 09:44:00', '2026-11-14 02:24:02'),
(273, 69, 'FKU-SEPA69-41', '41', 329000.00, NULL, NULL, 30, 0, 0, 0, 0, 10, 3, 0, '2026-07-15 09:44:00', '2026-11-14 02:24:02'),
(274, 69, 'FKU-SEPA69-42', '42', 329000.00, NULL, NULL, 41, 0, 0, 0, 0, 13, 3, 0, '2026-07-15 09:44:00', '2026-11-14 02:24:02'),
(275, 69, 'FKU-SEPA69-43', '43', 329000.00, NULL, NULL, 10, 0, 0, 0, 0, 3, 3, 0, '2026-07-15 09:44:00', '2026-11-14 02:24:02'),
(276, 69, 'FKU-SEPA69-44', '44', 329000.00, NULL, NULL, 21, 0, 0, 0, 0, 7, 3, 0, '2026-07-15 09:44:00', '2026-11-14 02:24:02'),
(277, 70, 'FKU-SEPA70-36', '36', 299000.00, 369000.00, 299000.00, 45, 0, 0, 0, 0, 15, 3, 1, '2026-07-13 10:57:00', '2026-11-14 02:24:02'),
(278, 70, 'FKU-SEPA70-37', '37', 299000.00, 369000.00, 299000.00, 14, 0, 0, 0, 0, 4, 3, 0, '2026-07-13 10:57:00', '2026-11-14 02:24:02'),
(279, 70, 'FKU-SEPA70-38', '38', 299000.00, 369000.00, 299000.00, 15, 0, 0, 0, 0, 8, 3, 0, '2026-07-13 10:57:00', '2026-11-14 02:24:02'),
(280, 70, 'FKU-SEPA70-39', '39', 299000.00, 369000.00, 299000.00, 36, 0, 0, 0, 0, 12, 3, 0, '2026-07-13 10:57:00', '2026-11-14 02:24:02'),
(281, 70, 'FKU-SEPA70-40', '40', 299000.00, 369000.00, 299000.00, 47, 0, 0, 0, 0, 15, 3, 0, '2026-07-13 10:57:00', '2026-11-14 02:24:02'),
(282, 71, 'FKU-SAND71-39', '39', 119000.00, 149000.00, 119000.00, 40, 0, 0, 0, 0, 13, 3, 1, '2026-07-11 01:10:00', '2026-11-14 02:24:02'),
(283, 71, 'FKU-SAND71-40', '40', 119000.00, 149000.00, 119000.00, 9, 0, 0, 0, 0, 3, 3, 0, '2026-07-11 01:10:00', '2026-11-14 02:24:02'),
(284, 71, 'FKU-SAND71-41', '41', 119000.00, 149000.00, 119000.00, 10, 0, 0, 0, 0, 6, 3, 0, '2026-07-11 01:10:00', '2026-11-14 02:24:02'),
(285, 71, 'FKU-SAND71-42', '42', 119000.00, 149000.00, 119000.00, 31, 0, 0, 0, 0, 10, 3, 0, '2026-07-11 01:10:00', '2026-11-14 02:24:02'),
(286, 71, 'FKU-SAND71-43', '43', 119000.00, 149000.00, 119000.00, 42, 0, 0, 0, 0, 14, 3, 0, '2026-07-11 01:10:00', '2026-11-14 02:24:02'),
(287, 71, 'FKU-SAND71-44', '44', 119000.00, 149000.00, 119000.00, 6, 0, 0, 0, 0, 3, 3, 0, '2026-07-11 01:10:00', '2026-11-14 02:24:02'),
(288, 72, 'FKU-SAND72-39', '39', 279000.00, NULL, NULL, 35, 0, 0, 0, 0, 11, 3, 1, '2026-07-09 02:23:00', '2026-11-14 02:24:02'),
(289, 72, 'FKU-SAND72-40', '40', 279000.00, NULL, NULL, 46, 0, 0, 0, 0, 15, 3, 0, '2026-07-09 02:23:00', '2026-11-14 02:24:02'),
(290, 72, 'FKU-SAND72-41', '41', 279000.00, NULL, NULL, 15, 0, 0, 0, 0, 5, 3, 0, '2026-07-09 02:23:00', '2026-11-14 02:24:02'),
(291, 72, 'FKU-SAND72-42', '42', 279000.00, NULL, NULL, 26, 0, 0, 0, 0, 8, 3, 0, '2026-07-09 02:23:00', '2026-11-14 02:24:02'),
(292, 72, 'FKU-SAND72-43', '43', 279000.00, NULL, NULL, 37, 0, 0, 0, 0, 12, 3, 0, '2026-07-09 02:23:00', '2026-11-14 02:24:02'),
(293, 73, 'FKU-SAND73-40', '40', 249000.00, 299000.00, 249000.00, 30, 0, 0, 0, 0, 10, 3, 1, '2026-07-07 03:36:00', '2026-11-14 02:24:02'),
(294, 73, 'FKU-SAND73-41', '41', 249000.00, 299000.00, 249000.00, 41, 0, 0, 0, 0, 13, 3, 0, '2026-07-07 03:36:00', '2026-11-14 02:24:02'),
(295, 73, 'FKU-SAND73-42', '42', 249000.00, 299000.00, 249000.00, 10, 0, 0, 0, 0, 3, 3, 0, '2026-07-07 03:36:00', '2026-11-14 02:24:02'),
(296, 73, 'FKU-SAND73-43', '43', 249000.00, 299000.00, 249000.00, 21, 0, 0, 0, 0, 7, 3, 0, '2026-07-07 03:36:00', '2026-11-14 02:24:02'),
(297, 73, 'FKU-SAND73-44', '44', 249000.00, 299000.00, 249000.00, 27, 0, 0, 0, 0, 10, 3, 0, '2026-07-07 03:36:00', '2026-11-14 02:24:02'),
(298, 74, 'FKU-SAND74-36', '36', 329000.00, NULL, NULL, 25, 0, 0, 0, 0, 8, 3, 1, '2026-07-05 04:49:00', '2026-07-05 04:49:00'),
(299, 74, 'FKU-SAND74-37', '37', 329000.00, NULL, NULL, 36, 0, 0, 0, 0, 12, 3, 0, '2026-07-05 04:49:00', '2026-07-05 04:49:00'),
(300, 74, 'FKU-SAND74-38', '38', 329000.00, NULL, NULL, 47, 0, 0, 0, 0, 15, 3, 0, '2026-07-05 04:49:00', '2026-07-05 04:49:00'),
(301, 74, 'FKU-SAND74-39', '39', 329000.00, NULL, NULL, 16, 0, 0, 0, 0, 5, 3, 0, '2026-07-05 04:49:00', '2026-07-05 04:49:00'),
(302, 74, 'FKU-SAND74-40', '40', 329000.00, NULL, NULL, 27, 0, 0, 0, 0, 9, 3, 0, '2026-07-05 04:49:00', '2026-07-05 04:49:00'),
(303, 75, 'FKU-TASR75-ORIGINAL', 'Original', 299000.00, 359000.00, 299000.00, 20, 0, 0, 0, 0, 6, 3, 1, '2026-07-03 05:02:00', '2026-11-14 02:24:02'),
(304, 76, 'FKU-TASR76-ORIGINAL', 'Original', 429000.00, NULL, NULL, 15, 0, 0, 0, 0, 5, 3, 1, '2026-07-01 06:15:00', '2026-11-14 02:24:02'),
(305, 77, 'FKU-TASR77-ORIGINAL', 'Original', 429000.00, 489000.00, 429000.00, 10, 0, 0, 0, 0, 3, 3, 1, '2026-06-29 07:28:00', '2026-11-14 02:24:02'),
(306, 78, 'FKU-TASR78-ORIGINAL', 'Original', 249000.00, NULL, NULL, 47, 0, 0, 0, 0, 15, 3, 1, '2026-06-27 08:41:00', '2026-11-14 02:24:02'),
(307, 79, 'FKU-TASR79-ORIGINAL', 'Original', 549000.00, NULL, NULL, 42, 0, 0, 0, 0, 14, 3, 1, '2026-06-25 09:54:00', '2026-11-14 02:24:02'),
(308, 80, 'FKU-TASS80-ORIGINAL', 'Original', 169000.00, 199000.00, 169000.00, 37, 0, 0, 0, 0, 12, 3, 1, '2026-06-23 10:07:00', '2026-11-14 02:24:02'),
(309, 81, 'FKU-TASS81-ORIGINAL', 'Original', 269000.00, NULL, NULL, 32, 0, 0, 0, 0, 10, 3, 1, '2026-06-21 01:20:00', '2026-11-14 02:24:02'),
(310, 82, 'FKU-TASS82-ORIGINAL', 'Original', 379000.00, 429000.00, 379000.00, 22, 0, 0, 0, 0, 9, 3, 1, '2026-06-19 02:33:00', '2026-11-14 02:24:02'),
(311, 83, 'FKU-TASS83-ORIGINAL', 'Original', 239000.00, NULL, NULL, 22, 0, 0, 0, 0, 7, 3, 1, '2026-06-17 03:46:00', '2026-11-14 02:24:02'),
(312, 84, 'FKU-TASS84-ORIGINAL', 'Original', 189000.00, 219000.00, 189000.00, 17, 0, 0, 0, 0, 5, 3, 1, '2026-06-15 04:59:00', '2026-11-14 02:24:02'),
(313, 85, 'FKU-TASS85-ORIGINAL', 'Original', 309000.00, NULL, NULL, 12, 0, 0, 0, 0, 4, 3, 1, '2026-06-13 05:12:00', '2026-11-14 02:24:02'),
(314, 86, 'FKU-DOMP86-ORIGINAL', 'Original', 169000.00, 199000.00, 169000.00, 7, 0, 0, 0, 0, 3, 3, 1, '2026-06-11 06:25:00', '2026-11-14 02:24:02'),
(315, 87, 'FKU-DOMP87-ORIGINAL', 'Original', 279000.00, NULL, NULL, 44, 0, 0, 0, 0, 14, 3, 1, '2026-06-09 07:38:00', '2026-06-09 07:38:00'),
(316, 88, 'FKU-DOMP88-ORIGINAL', 'Original', 119000.00, 149000.00, 119000.00, 34, 0, 0, 0, 0, 13, 3, 1, '2026-06-07 08:51:00', '2026-11-14 02:24:02'),
(317, 89, 'FKU-DOMP89-ORIGINAL', 'Original', 129000.00, NULL, NULL, 34, 0, 0, 0, 0, 11, 3, 1, '2026-06-05 09:04:00', '2026-11-14 02:24:02'),
(318, 90, 'FKU-JAMT90-ORIGINAL', 'Original', 359000.00, 429000.00, 359000.00, 29, 0, 0, 0, 0, 9, 3, 1, '2026-06-03 10:17:00', '2026-11-14 02:24:02'),
(319, 91, 'FKU-JAMT91-ORIGINAL', 'Original', 489000.00, NULL, NULL, 24, 0, 0, 0, 0, 8, 3, 1, '2026-06-01 01:30:00', '2026-11-14 02:24:02'),
(320, 92, 'FKU-JAMT92-ORIGINAL', 'Original', 299000.00, 359000.00, 299000.00, 19, 0, 0, 0, 0, 6, 3, 1, '2026-05-30 02:43:00', '2026-11-14 02:24:02'),
(321, 93, 'FKU-JAMT93-ORIGINAL', 'Original', 529000.00, NULL, NULL, 14, 0, 0, 0, 0, 4, 3, 1, '2026-05-28 03:56:00', '2026-11-14 02:24:02'),
(322, 94, 'FKU-JAMT94-ORIGINAL', 'Original', 599000.00, 699000.00, 599000.00, 9, 0, 0, 0, 0, 3, 3, 1, '2026-05-26 04:09:00', '2026-11-14 02:24:02'),
(323, 95, 'FKU-KACA95-ORIGINAL', 'Original', 229000.00, 279000.00, 229000.00, 46, 0, 0, 0, 0, 15, 3, 1, '2026-05-24 05:22:00', '2026-11-14 02:24:02'),
(324, 96, 'FKU-KACA96-ORIGINAL', 'Original', 329000.00, NULL, NULL, 31, 0, 0, 0, 0, 13, 3, 1, '2026-05-22 06:35:00', '2026-11-14 02:24:02'),
(325, 97, 'FKU-KACA97-ORIGINAL', 'Original', 249000.00, 299000.00, 249000.00, 36, 0, 0, 0, 0, 12, 3, 1, '2026-05-20 07:48:00', '2026-11-14 02:24:02'),
(326, 98, 'FKU-PERH98-ORIGINAL', 'Original', 149000.00, 179000.00, 149000.00, 31, 0, 0, 0, 0, 10, 3, 1, '2026-05-18 08:01:00', '2026-11-14 02:24:02'),
(327, 99, 'FKU-PERH99-ORIGINAL', 'Original', 129000.00, NULL, NULL, 26, 0, 0, 0, 0, 8, 3, 1, '2026-05-16 09:14:00', '2026-11-14 02:24:02'),
(328, 100, 'FKU-PERH100-ORIGINAL', 'Original', 79000.00, 99000.00, 79000.00, 21, 0, 0, 0, 0, 7, 3, 1, '2026-05-14 10:27:00', '2026-11-14 02:24:02');

-- --------------------------------------------------------

--
-- Table structure for table `product_variant_values`
--

CREATE TABLE `product_variant_values` (
  `id` bigint UNSIGNED NOT NULL,
  `variant_id` bigint UNSIGNED NOT NULL,
  `attribute_id` bigint UNSIGNED NOT NULL,
  `value` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_variant_values`
--

INSERT INTO `product_variant_values` (`id`, `variant_id`, `attribute_id`, `value`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'S', NULL, NULL),
(2, 2, 1, 'M', NULL, NULL),
(3, 3, 1, 'L', NULL, NULL),
(4, 4, 1, 'XL', NULL, NULL),
(5, 5, 1, 'XXL', NULL, NULL),
(6, 6, 1, 'S', NULL, NULL),
(7, 7, 1, 'M', NULL, NULL),
(8, 8, 1, 'L', NULL, NULL),
(9, 9, 1, 'XL', NULL, NULL),
(10, 10, 1, 'S', NULL, NULL),
(11, 11, 1, 'M', NULL, NULL),
(12, 12, 1, 'L', NULL, NULL),
(13, 13, 1, 'XL', NULL, NULL),
(14, 14, 1, 'S', NULL, NULL),
(15, 15, 1, 'M', NULL, NULL),
(16, 16, 1, 'L', NULL, NULL),
(17, 17, 1, 'XL', NULL, NULL),
(18, 18, 1, 'S', NULL, NULL),
(19, 19, 1, 'M', NULL, NULL),
(20, 20, 1, 'L', NULL, NULL),
(21, 21, 1, 'XL', NULL, NULL),
(22, 22, 1, 'M', NULL, NULL),
(23, 23, 1, 'L', NULL, NULL),
(24, 24, 1, 'XL', NULL, NULL),
(25, 25, 1, 'S', NULL, NULL),
(26, 26, 1, 'M', NULL, NULL),
(27, 27, 1, 'L', NULL, NULL),
(28, 28, 1, 'S', NULL, NULL),
(29, 29, 1, 'M', NULL, NULL),
(30, 30, 1, 'L', NULL, NULL),
(31, 31, 1, 'S', NULL, NULL),
(32, 32, 1, 'M', NULL, NULL),
(33, 33, 1, 'L', NULL, NULL),
(34, 34, 1, 'XL', NULL, NULL),
(35, 35, 1, 'M', NULL, NULL),
(36, 36, 1, 'L', NULL, NULL),
(37, 37, 1, 'XL', NULL, NULL),
(38, 38, 1, 'S', NULL, NULL),
(39, 39, 1, 'M', NULL, NULL),
(40, 40, 1, 'L', NULL, NULL),
(41, 41, 1, 'XL', NULL, NULL),
(42, 42, 1, 'S', NULL, NULL),
(43, 43, 1, 'M', NULL, NULL),
(44, 44, 1, 'L', NULL, NULL),
(45, 45, 1, 'XL', NULL, NULL),
(46, 46, 1, 'M', NULL, NULL),
(47, 47, 1, 'L', NULL, NULL),
(48, 48, 1, 'XL', NULL, NULL),
(49, 49, 1, 'S', NULL, NULL),
(50, 50, 1, 'M', NULL, NULL),
(51, 51, 1, 'L', NULL, NULL),
(52, 52, 1, 'XL', NULL, NULL),
(53, 53, 1, 'S', NULL, NULL),
(54, 54, 1, 'M', NULL, NULL),
(55, 55, 1, 'L', NULL, NULL),
(56, 56, 1, 'XL', NULL, NULL),
(57, 57, 1, 'M', NULL, NULL),
(58, 58, 1, 'L', NULL, NULL),
(59, 59, 1, 'XL', NULL, NULL),
(60, 60, 1, 'S', NULL, NULL),
(61, 61, 1, 'M', NULL, NULL),
(62, 62, 1, 'L', NULL, NULL),
(63, 63, 1, 'M', NULL, NULL),
(64, 64, 1, 'L', NULL, NULL),
(65, 65, 1, 'XL', NULL, NULL),
(66, 66, 1, 'S', NULL, NULL),
(67, 67, 1, 'M', NULL, NULL),
(68, 68, 1, 'L', NULL, NULL),
(69, 69, 1, 'XL', NULL, NULL),
(70, 70, 1, 'M', NULL, NULL),
(71, 71, 1, 'L', NULL, NULL),
(72, 72, 1, 'XL', NULL, NULL),
(73, 73, 1, 'S', NULL, NULL),
(74, 74, 1, 'M', NULL, NULL),
(75, 75, 1, 'L', NULL, NULL),
(76, 76, 1, 'XL', NULL, NULL),
(77, 77, 1, 'M', NULL, NULL),
(78, 78, 1, 'L', NULL, NULL),
(79, 79, 1, 'XL', NULL, NULL),
(80, 80, 1, 'M', NULL, NULL),
(81, 81, 1, 'L', NULL, NULL),
(82, 82, 1, 'XL', NULL, NULL),
(83, 83, 1, 'S', NULL, NULL),
(84, 84, 1, 'M', NULL, NULL),
(85, 85, 1, 'L', NULL, NULL),
(86, 86, 1, 'XL', NULL, NULL),
(87, 87, 1, '28', NULL, NULL),
(88, 88, 1, '29', NULL, NULL),
(89, 89, 1, '30', NULL, NULL),
(90, 90, 1, '31', NULL, NULL),
(91, 91, 1, '32', NULL, NULL),
(92, 92, 1, '33', NULL, NULL),
(93, 93, 1, '29', NULL, NULL),
(94, 94, 1, '30', NULL, NULL),
(95, 95, 1, '31', NULL, NULL),
(96, 96, 1, '32', NULL, NULL),
(97, 97, 1, '33', NULL, NULL),
(98, 98, 1, '34', NULL, NULL),
(99, 99, 1, '30', NULL, NULL),
(100, 100, 1, '31', NULL, NULL),
(101, 101, 1, '32', NULL, NULL),
(102, 102, 1, '33', NULL, NULL),
(103, 103, 1, '34', NULL, NULL),
(104, 104, 1, '29', NULL, NULL),
(105, 105, 1, '30', NULL, NULL),
(106, 106, 1, '31', NULL, NULL),
(107, 107, 1, '32', NULL, NULL),
(108, 108, 1, '33', NULL, NULL),
(109, 109, 1, 'M', NULL, NULL),
(110, 110, 1, 'L', NULL, NULL),
(111, 111, 1, 'XL', NULL, NULL),
(112, 112, 1, '30', NULL, NULL),
(113, 113, 1, '31', NULL, NULL),
(114, 114, 1, '32', NULL, NULL),
(115, 115, 1, '33', NULL, NULL),
(116, 116, 1, '34', NULL, NULL),
(117, 117, 1, '29', NULL, NULL),
(118, 118, 1, '30', NULL, NULL),
(119, 119, 1, '31', NULL, NULL),
(120, 120, 1, '32', NULL, NULL),
(121, 121, 1, '33', NULL, NULL),
(122, 122, 1, '34', NULL, NULL),
(123, 123, 1, 'S', NULL, NULL),
(124, 124, 1, 'M', NULL, NULL),
(125, 125, 1, 'L', NULL, NULL),
(126, 126, 1, 'XL', NULL, NULL),
(127, 127, 1, 'S', NULL, NULL),
(128, 128, 1, 'M', NULL, NULL),
(129, 129, 1, 'L', NULL, NULL),
(130, 130, 1, 'S', NULL, NULL),
(131, 131, 1, 'M', NULL, NULL),
(132, 132, 1, 'L', NULL, NULL),
(133, 133, 1, 'XL', NULL, NULL),
(134, 134, 1, 'M', NULL, NULL),
(135, 135, 1, 'L', NULL, NULL),
(136, 136, 1, 'XL', NULL, NULL),
(137, 137, 1, 'S', NULL, NULL),
(138, 138, 1, 'M', NULL, NULL),
(139, 139, 1, 'L', NULL, NULL),
(140, 140, 1, 'XL', NULL, NULL),
(141, 141, 1, 'S', NULL, NULL),
(142, 142, 1, 'M', NULL, NULL),
(143, 143, 1, 'L', NULL, NULL),
(144, 144, 1, 'S', NULL, NULL),
(145, 145, 1, 'M', NULL, NULL),
(146, 146, 1, 'L', NULL, NULL),
(147, 147, 1, 'S', NULL, NULL),
(148, 148, 1, 'M', NULL, NULL),
(149, 149, 1, 'L', NULL, NULL),
(150, 150, 1, 'XL', NULL, NULL),
(151, 151, 1, 'S', NULL, NULL),
(152, 152, 1, 'M', NULL, NULL),
(153, 153, 1, 'L', NULL, NULL),
(154, 154, 1, 'S', NULL, NULL),
(155, 155, 1, 'M', NULL, NULL),
(156, 156, 1, 'L', NULL, NULL),
(157, 157, 1, 'XL', NULL, NULL),
(158, 158, 1, 'S', NULL, NULL),
(159, 159, 1, 'M', NULL, NULL),
(160, 160, 1, 'L', NULL, NULL),
(161, 161, 1, 'XL', NULL, NULL),
(162, 162, 1, 'S', NULL, NULL),
(163, 163, 1, 'M', NULL, NULL),
(164, 164, 1, 'L', NULL, NULL),
(165, 165, 1, 'XL', NULL, NULL),
(166, 166, 1, 'S', NULL, NULL),
(167, 167, 1, 'M', NULL, NULL),
(168, 168, 1, 'L', NULL, NULL),
(169, 169, 1, 'S', NULL, NULL),
(170, 170, 1, 'M', NULL, NULL),
(171, 171, 1, 'L', NULL, NULL),
(172, 172, 1, 'S', NULL, NULL),
(173, 173, 1, 'M', NULL, NULL),
(174, 174, 1, 'L', NULL, NULL),
(175, 175, 1, 'XL', NULL, NULL),
(176, 176, 1, 'S', NULL, NULL),
(177, 177, 1, 'M', NULL, NULL),
(178, 178, 1, 'L', NULL, NULL),
(179, 179, 1, 'S', NULL, NULL),
(180, 180, 1, 'M', NULL, NULL),
(181, 181, 1, 'L', NULL, NULL),
(182, 182, 1, 'XL', NULL, NULL),
(183, 183, 1, 'S', NULL, NULL),
(184, 184, 1, 'M', NULL, NULL),
(185, 185, 1, 'L', NULL, NULL),
(186, 186, 1, 'XL', NULL, NULL),
(187, 187, 1, 'S', NULL, NULL),
(188, 188, 1, 'M', NULL, NULL),
(189, 189, 1, 'L', NULL, NULL),
(190, 190, 1, 'XL', NULL, NULL),
(191, 191, 1, 'S', NULL, NULL),
(192, 192, 1, 'M', NULL, NULL),
(193, 193, 1, 'L', NULL, NULL),
(194, 194, 1, 'S', NULL, NULL),
(195, 195, 1, 'M', NULL, NULL),
(196, 196, 1, 'L', NULL, NULL),
(197, 197, 1, 'XL', NULL, NULL),
(198, 198, 1, 'S', NULL, NULL),
(199, 199, 1, 'M', NULL, NULL),
(200, 200, 1, 'L', NULL, NULL),
(201, 201, 1, 'XL', NULL, NULL),
(202, 202, 1, 'S', NULL, NULL),
(203, 203, 1, 'M', NULL, NULL),
(204, 204, 1, 'L', NULL, NULL),
(205, 205, 1, 'XL', NULL, NULL),
(206, 206, 1, 'S', NULL, NULL),
(207, 207, 1, 'M', NULL, NULL),
(208, 208, 1, 'L', NULL, NULL),
(209, 209, 1, 'S', NULL, NULL),
(210, 210, 1, 'M', NULL, NULL),
(211, 211, 1, 'L', NULL, NULL),
(212, 212, 1, 'XL', NULL, NULL),
(213, 213, 1, 'S', NULL, NULL),
(214, 214, 1, 'M', NULL, NULL),
(215, 215, 1, 'L', NULL, NULL),
(216, 216, 1, 'S', NULL, NULL),
(217, 217, 1, 'M', NULL, NULL),
(218, 218, 1, 'L', NULL, NULL),
(219, 219, 1, 'XL', NULL, NULL),
(220, 220, 1, '39', NULL, NULL),
(221, 221, 1, '40', NULL, NULL),
(222, 222, 1, '41', NULL, NULL),
(223, 223, 1, '42', NULL, NULL),
(224, 224, 1, '43', NULL, NULL),
(225, 225, 1, '44', NULL, NULL),
(226, 226, 1, '39', NULL, NULL),
(227, 227, 1, '40', NULL, NULL),
(228, 228, 1, '41', NULL, NULL),
(229, 229, 1, '42', NULL, NULL),
(230, 230, 1, '43', NULL, NULL),
(231, 231, 1, '40', NULL, NULL),
(232, 232, 1, '41', NULL, NULL),
(233, 233, 1, '42', NULL, NULL),
(234, 234, 1, '43', NULL, NULL),
(235, 235, 1, '44', NULL, NULL),
(236, 236, 1, '39', NULL, NULL),
(237, 237, 1, '40', NULL, NULL),
(238, 238, 1, '41', NULL, NULL),
(239, 239, 1, '42', NULL, NULL),
(240, 240, 1, '43', NULL, NULL),
(241, 241, 1, '40', NULL, NULL),
(242, 242, 1, '41', NULL, NULL),
(243, 243, 1, '42', NULL, NULL),
(244, 244, 1, '43', NULL, NULL),
(245, 245, 1, '44', NULL, NULL),
(246, 246, 1, '40', NULL, NULL),
(247, 247, 1, '41', NULL, NULL),
(248, 248, 1, '42', NULL, NULL),
(249, 249, 1, '43', NULL, NULL),
(250, 250, 1, '44', NULL, NULL),
(251, 251, 1, '40', NULL, NULL),
(252, 252, 1, '41', NULL, NULL),
(253, 253, 1, '42', NULL, NULL),
(254, 254, 1, '43', NULL, NULL),
(255, 255, 1, '44', NULL, NULL),
(256, 256, 1, '40', NULL, NULL),
(257, 257, 1, '41', NULL, NULL),
(258, 258, 1, '42', NULL, NULL),
(259, 259, 1, '43', NULL, NULL),
(260, 260, 1, '44', NULL, NULL),
(261, 261, 1, '37', NULL, NULL),
(262, 262, 1, '38', NULL, NULL),
(263, 263, 1, '39', NULL, NULL),
(264, 264, 1, '40', NULL, NULL),
(265, 265, 1, '41', NULL, NULL),
(266, 266, 1, '36', NULL, NULL),
(267, 267, 1, '37', NULL, NULL),
(268, 268, 1, '38', NULL, NULL),
(269, 269, 1, '39', NULL, NULL),
(270, 270, 1, '40', NULL, NULL),
(271, 271, 1, '39', NULL, NULL),
(272, 272, 1, '40', NULL, NULL),
(273, 273, 1, '41', NULL, NULL),
(274, 274, 1, '42', NULL, NULL),
(275, 275, 1, '43', NULL, NULL),
(276, 276, 1, '44', NULL, NULL),
(277, 277, 1, '36', NULL, NULL),
(278, 278, 1, '37', NULL, NULL),
(279, 279, 1, '38', NULL, NULL),
(280, 280, 1, '39', NULL, NULL),
(281, 281, 1, '40', NULL, NULL),
(282, 282, 1, '39', NULL, NULL),
(283, 283, 1, '40', NULL, NULL),
(284, 284, 1, '41', NULL, NULL),
(285, 285, 1, '42', NULL, NULL),
(286, 286, 1, '43', NULL, NULL),
(287, 287, 1, '44', NULL, NULL),
(288, 288, 1, '39', NULL, NULL),
(289, 289, 1, '40', NULL, NULL),
(290, 290, 1, '41', NULL, NULL),
(291, 291, 1, '42', NULL, NULL),
(292, 292, 1, '43', NULL, NULL),
(293, 293, 1, '40', NULL, NULL),
(294, 294, 1, '41', NULL, NULL),
(295, 295, 1, '42', NULL, NULL),
(296, 296, 1, '43', NULL, NULL),
(297, 297, 1, '44', NULL, NULL),
(298, 298, 1, '36', NULL, NULL),
(299, 299, 1, '37', NULL, NULL),
(300, 300, 1, '38', NULL, NULL),
(301, 301, 1, '39', NULL, NULL),
(302, 302, 1, '40', NULL, NULL),
(303, 303, 1, 'Original', NULL, NULL),
(304, 304, 1, 'Original', NULL, NULL),
(305, 305, 1, 'Original', NULL, NULL),
(306, 306, 1, 'Original', NULL, NULL),
(307, 307, 1, 'Original', NULL, NULL),
(308, 308, 1, 'Original', NULL, NULL),
(309, 309, 1, 'Original', NULL, NULL),
(310, 310, 1, 'Original', NULL, NULL),
(311, 311, 1, 'Original', NULL, NULL),
(312, 312, 1, 'Original', NULL, NULL),
(313, 313, 1, 'Original', NULL, NULL),
(314, 314, 1, 'Original', NULL, NULL),
(315, 315, 1, 'Original', NULL, NULL),
(316, 316, 1, 'Original', NULL, NULL),
(317, 317, 1, 'Original', NULL, NULL),
(318, 318, 1, 'Original', NULL, NULL),
(319, 319, 1, 'Original', NULL, NULL),
(320, 320, 1, 'Original', NULL, NULL),
(321, 321, 1, 'Original', NULL, NULL),
(322, 322, 1, 'Original', NULL, NULL),
(323, 323, 1, 'Original', NULL, NULL),
(324, 324, 1, 'Original', NULL, NULL),
(325, 325, 1, 'Original', NULL, NULL),
(326, 326, 1, 'Original', NULL, NULL),
(327, 327, 1, 'Original', NULL, NULL),
(328, 328, 1, 'Original', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `promotions`
--

CREATE TABLE `promotions` (
  `id` bigint UNSIGNED NOT NULL,
  `promotion_payment_id` bigint UNSIGNED DEFAULT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mobile_image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `click_action` enum('none','product','category','url') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'none',
  `target_id` bigint UNSIGNED DEFAULT NULL,
  `target_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int UNSIGNED NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `approval_status` enum('pending','approved','rejected') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `rejection_reason` text COLLATE utf8mb4_unicode_ci,
  `submitted_at` timestamp NULL DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `approved_by` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_by` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `promotions`
--

INSERT INTO `promotions` (`id`, `promotion_payment_id`, `name`, `image_url`, `mobile_image_url`, `click_action`, `target_id`, `target_url`, `sort_order`, `is_active`, `approval_status`, `rejection_reason`, `submitted_at`, `approved_at`, `approved_by`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, NULL, 'Koleksi Baru Desember', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80', 'category', 1, NULL, 1, 1, 'approved', NULL, '2026-11-12 20:24:02', '2026-11-12 22:24:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-12 20:24:02', '2026-11-14 02:24:02', NULL),
(2, NULL, 'Diskon Dress & Blus Wanita', 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1600&q=80', 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80', 'category', 7, NULL, 2, 1, 'approved', NULL, '2026-11-12 22:24:02', '2026-11-13 00:24:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-12 22:24:02', '2026-11-14 02:24:02', NULL),
(3, NULL, 'Gratis Ongkir di Atas 300RB', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80', 'url', NULL, '/promotions', 3, 1, 'approved', NULL, '2026-11-13 00:24:02', '2026-11-13 02:24:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-13 00:24:02', '2026-11-14 02:24:02', NULL),
(4, NULL, 'Sneakers & Sepatu Pilihan', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=80', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80', 'category', 14, NULL, 4, 1, 'approved', NULL, '2026-11-13 02:24:02', '2026-11-13 04:24:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-13 02:24:02', '2026-11-14 02:24:02', NULL),
(5, NULL, 'Batik Nusantara Pilihan', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80', 'product', 15, NULL, 5, 1, 'approved', NULL, '2026-11-13 04:24:02', '2026-11-13 06:24:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-13 04:24:02', '2026-11-14 02:24:02', NULL),
(6, NULL, 'Flash Sale Tas & Dompet', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80', 'category', 16, NULL, 6, 1, 'approved', NULL, '2026-11-13 06:24:02', '2026-11-13 08:24:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-13 06:24:02', '2026-11-14 02:24:02', NULL),
(7, NULL, 'Promo Payday Akhir Bulan', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80', 'url', NULL, '/promotions', 7, 0, 'pending', NULL, '2026-11-13 08:24:02', NULL, NULL, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-13 08:24:02', '2026-11-14 02:24:02', NULL),
(8, NULL, 'Promo Kemeja Kerja', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1600&q=80', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80', 'category', 4, NULL, 8, 0, 'rejected', 'Banner belum memenuhi rasio 4:1 untuk mobile, mohon unggah ulang.', '2026-11-13 10:24:02', NULL, NULL, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-13 10:24:02', '2026-11-14 02:24:02', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `promotion_payments`
--

CREATE TABLE `promotion_payments` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_number` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `package_name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `payment_method` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `proof_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `rejection_reason` text COLLATE utf8mb4_unicode_ci,
  `paid_at` timestamp NULL DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `reviewed_by` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_by` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `raw_materials`
--

CREATE TABLE `raw_materials` (
  `id` bigint UNSIGNED NOT NULL,
  `code` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `unit` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pcs',
  `stock` decimal(18,4) NOT NULL DEFAULT '0.0000',
  `minimum_stock` decimal(18,4) NOT NULL DEFAULT '0.0000',
  `average_cost` decimal(18,4) NOT NULL DEFAULT '0.0000',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `raw_materials`
--

INSERT INTO `raw_materials` (`id`, `code`, `name`, `unit`, `stock`, `minimum_stock`, `average_cost`, `is_active`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'RM-KTN-24S', 'Katun Combed 24s', 'kg', 330.5000, 60.0000, 96500.0000, 1, '2026-07-17 02:24:37', '2026-11-14 02:24:37', NULL),
(2, 'RM-KTN-30S', 'Katun Combed 30s', 'kg', 244.0000, 40.0000, 104000.0000, 1, '2026-07-17 02:24:37', '2026-11-14 02:24:37', NULL),
(3, 'RM-FLC-20S', 'Cotton Fleece 20s', 'kg', 190.2500, 30.0000, 118500.0000, 1, '2026-07-17 02:24:37', '2026-11-14 02:24:37', NULL),
(4, 'RM-LNN-BLD', 'Linen Blend', 'meter', 236.0000, 50.0000, 68500.0000, 1, '2026-07-17 02:24:37', '2026-11-14 02:24:37', NULL),
(5, 'RM-DNM-12OZ', 'Denim 12 oz', 'meter', 190.5000, 40.0000, 92000.0000, 1, '2026-07-17 02:24:37', '2026-11-14 02:24:37', NULL),
(6, 'RM-KTN-PRM', 'Katun Primisima Batik', 'meter', 160.0000, 30.0000, 78000.0000, 1, '2026-07-17 02:24:37', '2026-11-14 02:24:37', NULL),
(7, 'RM-RYN', 'Rayon', 'meter', 244.5000, 35.0000, 42000.0000, 1, '2026-07-17 02:24:37', '2026-11-14 02:24:37', NULL),
(8, 'RM-CRD-500D', 'Cordura 500D', 'meter', 165.0000, 20.0000, 135000.0000, 1, '2026-07-17 02:24:37', '2026-11-14 02:24:37', NULL),
(9, 'RM-KLT-SAPI', 'Kulit Sapi Full Grain', 'sqft', 183.0000, 25.0000, 187000.0000, 1, '2026-07-17 02:24:37', '2026-11-14 02:24:37', NULL),
(10, 'RM-BNG-JHT', 'Benang Jahit', 'roll', 329.0000, 80.0000, 12500.0000, 1, '2026-07-17 02:24:37', '2026-11-14 02:24:37', NULL),
(11, 'RM-KNC', 'Kancing', 'gross', 191.0000, 30.0000, 27000.0000, 1, '2026-07-17 02:24:37', '2026-11-14 02:24:37', NULL),
(12, 'RM-RST-YKK', 'Resleting YKK', 'pcs', 497.0000, 150.0000, 6500.0000, 1, '2026-07-17 02:24:37', '2026-11-14 02:24:37', NULL),
(13, 'RM-LBL', 'Label Woven', 'pcs', 1618.0000, 400.0000, 850.0000, 1, '2026-07-17 02:24:37', '2026-11-14 02:24:37', NULL),
(14, 'RM-BOX', 'Box Packaging', 'pcs', 426.0000, 350.0000, 4200.0000, 1, '2026-07-17 02:24:37', '2026-11-14 02:24:37', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `raw_material_cost_histories`
--

CREATE TABLE `raw_material_cost_histories` (
  `id` bigint UNSIGNED NOT NULL,
  `raw_material_id` bigint UNSIGNED NOT NULL,
  `raw_material_stock_movement_id` bigint UNSIGNED DEFAULT NULL,
  `old_average_cost` decimal(18,4) NOT NULL DEFAULT '0.0000',
  `new_average_cost` decimal(18,4) NOT NULL DEFAULT '0.0000',
  `change_amount` decimal(18,4) NOT NULL DEFAULT '0.0000',
  `change_percent` decimal(12,4) NOT NULL DEFAULT '0.0000',
  `direction` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unchanged',
  `reference_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'restock',
  `reference_number` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `occurred_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `raw_material_cost_histories`
--

INSERT INTO `raw_material_cost_histories` (`id`, `raw_material_id`, `raw_material_stock_movement_id`, `old_average_cost`, `new_average_cost`, `change_amount`, `change_percent`, `direction`, `reference_type`, `reference_number`, `occurred_at`, `created_at`, `updated_at`) VALUES
(1, 1, 4, 90710.0000, 94570.0000, 3860.0000, 4.2553, 'up', 'purchase', 'PO-2026-0028', '2026-10-17 02:00:00', '2026-10-17 02:00:00', '2026-10-17 02:00:00'),
(2, 1, 6, 94570.0000, 96500.0000, 1930.0000, 2.0408, 'up', 'purchase', 'PO-2026-0004', '2026-11-10 02:00:00', '2026-11-10 02:00:00', '2026-11-10 02:00:00'),
(3, 2, 11, 97760.0000, 101920.0000, 4160.0000, 4.2553, 'up', 'purchase', 'PO-2026-0032', '2026-10-17 03:07:00', '2026-10-17 03:07:00', '2026-10-17 03:07:00'),
(4, 2, 13, 101920.0000, 104000.0000, 2080.0000, 2.0408, 'up', 'purchase', 'PO-2026-0008', '2026-11-10 03:07:00', '2026-11-10 03:07:00', '2026-11-10 03:07:00'),
(5, 3, 18, 111390.0000, 116130.0000, 4740.0000, 4.2553, 'up', 'purchase', 'PO-2026-0036', '2026-10-17 04:14:00', '2026-10-17 04:14:00', '2026-10-17 04:14:00'),
(6, 3, 20, 116130.0000, 118500.0000, 2370.0000, 2.0408, 'up', 'purchase', 'PO-2026-0012', '2026-11-10 04:14:00', '2026-11-10 04:14:00', '2026-11-10 04:14:00'),
(7, 4, 25, 64390.0000, 67130.0000, 2740.0000, 4.2553, 'up', 'purchase', 'PO-2026-0040', '2026-10-17 05:21:00', '2026-10-17 05:21:00', '2026-10-17 05:21:00'),
(8, 4, 27, 67130.0000, 68500.0000, 1370.0000, 2.0408, 'up', 'purchase', 'PO-2026-0016', '2026-11-10 05:21:00', '2026-11-10 05:21:00', '2026-11-10 05:21:00'),
(9, 5, 32, 86480.0000, 90160.0000, 3680.0000, 4.2553, 'up', 'purchase', 'PO-2026-0044', '2026-10-17 06:28:00', '2026-10-17 06:28:00', '2026-10-17 06:28:00'),
(10, 5, 34, 90160.0000, 92000.0000, 1840.0000, 2.0408, 'up', 'purchase', 'PO-2026-0020', '2026-11-10 06:28:00', '2026-11-10 06:28:00', '2026-11-10 06:28:00'),
(11, 6, 39, 73320.0000, 76440.0000, 3120.0000, 4.2553, 'up', 'purchase', 'PO-2026-0048', '2026-10-17 07:35:00', '2026-10-17 07:35:00', '2026-10-17 07:35:00'),
(12, 6, 41, 76440.0000, 78000.0000, 1560.0000, 2.0408, 'up', 'purchase', 'PO-2026-0024', '2026-11-10 07:35:00', '2026-11-10 07:35:00', '2026-11-10 07:35:00'),
(13, 7, 46, 39480.0000, 41160.0000, 1680.0000, 4.2553, 'up', 'purchase', 'PO-2026-0052', '2026-10-17 08:42:00', '2026-10-17 08:42:00', '2026-10-17 08:42:00'),
(14, 7, 48, 41160.0000, 42000.0000, 840.0000, 2.0408, 'up', 'purchase', 'PO-2026-0028', '2026-11-10 08:42:00', '2026-11-10 08:42:00', '2026-11-10 08:42:00'),
(15, 8, 53, 126900.0000, 132300.0000, 5400.0000, 4.2553, 'up', 'purchase', 'PO-2026-0056', '2026-10-17 09:49:00', '2026-10-17 09:49:00', '2026-10-17 09:49:00'),
(16, 8, 55, 132300.0000, 135000.0000, 2700.0000, 2.0408, 'up', 'purchase', 'PO-2026-0032', '2026-11-10 09:49:00', '2026-11-10 09:49:00', '2026-11-10 09:49:00'),
(17, 9, 60, 175780.0000, 183260.0000, 7480.0000, 4.2553, 'up', 'purchase', 'PO-2026-0060', '2026-10-17 02:56:00', '2026-10-17 02:56:00', '2026-10-17 02:56:00'),
(18, 9, 62, 183260.0000, 187000.0000, 3740.0000, 2.0408, 'up', 'purchase', 'PO-2026-0036', '2026-11-10 02:56:00', '2026-11-10 02:56:00', '2026-11-10 02:56:00'),
(19, 10, 67, 11750.0000, 12250.0000, 500.0000, 4.2553, 'up', 'purchase', 'PO-2026-0064', '2026-10-17 03:03:00', '2026-10-17 03:03:00', '2026-10-17 03:03:00'),
(20, 10, 69, 12250.0000, 12500.0000, 250.0000, 2.0408, 'up', 'purchase', 'PO-2026-0040', '2026-11-10 03:03:00', '2026-11-10 03:03:00', '2026-11-10 03:03:00'),
(21, 11, 74, 25380.0000, 26460.0000, 1080.0000, 4.2553, 'up', 'purchase', 'PO-2026-0068', '2026-10-17 04:10:00', '2026-10-17 04:10:00', '2026-10-17 04:10:00'),
(22, 11, 76, 26460.0000, 27000.0000, 540.0000, 2.0408, 'up', 'purchase', 'PO-2026-0044', '2026-11-10 04:10:00', '2026-11-10 04:10:00', '2026-11-10 04:10:00'),
(23, 12, 81, 6110.0000, 6370.0000, 260.0000, 4.2553, 'up', 'purchase', 'PO-2026-0072', '2026-10-17 05:17:00', '2026-10-17 05:17:00', '2026-10-17 05:17:00'),
(24, 12, 83, 6370.0000, 6500.0000, 130.0000, 2.0408, 'up', 'purchase', 'PO-2026-0048', '2026-11-10 05:17:00', '2026-11-10 05:17:00', '2026-11-10 05:17:00'),
(25, 13, 88, 799.0000, 833.0000, 34.0000, 4.2553, 'up', 'purchase', 'PO-2026-0076', '2026-10-17 06:24:00', '2026-10-17 06:24:00', '2026-10-17 06:24:00'),
(26, 13, 90, 833.0000, 850.0000, 17.0000, 2.0408, 'up', 'purchase', 'PO-2026-0052', '2026-11-10 06:24:00', '2026-11-10 06:24:00', '2026-11-10 06:24:00'),
(27, 14, 95, 3948.0000, 4116.0000, 168.0000, 4.2553, 'up', 'purchase', 'PO-2026-0080', '2026-10-17 07:31:00', '2026-10-17 07:31:00', '2026-10-17 07:31:00'),
(28, 14, 97, 4116.0000, 4200.0000, 84.0000, 2.0408, 'up', 'purchase', 'PO-2026-0056', '2026-11-10 07:31:00', '2026-11-10 07:31:00', '2026-11-10 07:31:00');

-- --------------------------------------------------------

--
-- Table structure for table `raw_material_stock_movements`
--

CREATE TABLE `raw_material_stock_movements` (
  `id` bigint UNSIGNED NOT NULL,
  `raw_material_id` bigint UNSIGNED NOT NULL,
  `type` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity_delta` decimal(18,4) NOT NULL,
  `balance_after` decimal(18,4) NOT NULL,
  `unit_cost` decimal(18,4) NOT NULL DEFAULT '0.0000',
  `total_cost` decimal(18,4) NOT NULL DEFAULT '0.0000',
  `reference_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'manual',
  `reference_number` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `occurred_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `raw_material_stock_movements`
--

INSERT INTO `raw_material_stock_movements` (`id`, `raw_material_id`, `type`, `quantity_delta`, `balance_after`, `unit_cost`, `total_cost`, `reference_type`, `reference_number`, `notes`, `occurred_at`, `created_at`, `updated_at`) VALUES
(1, 1, 'in', 272.5000, 272.5000, 90710.0000, 24718475.0000, 'purchase', 'PO-2026-0095', 'Stok awal gudang', '2026-08-11 02:00:00', '2026-08-11 02:00:00', '2026-08-11 02:00:00'),
(2, 1, 'out', -30.0000, 242.5000, 90710.0000, 2721300.0000, 'production', 'PRD-20261114-001', 'Pemakaian produksi', '2026-09-13 02:00:00', '2026-09-13 02:00:00', '2026-09-13 02:00:00'),
(3, 1, 'out', -22.0000, 220.5000, 90710.0000, 1995620.0000, 'production', 'PRD-20261114-001', 'Pemakaian produksi', '2026-10-04 02:00:00', '2026-10-04 02:00:00', '2026-10-04 02:00:00'),
(4, 1, 'in', 80.0000, 300.5000, 94570.0000, 7565600.0000, 'purchase', 'PO-2026-0028', 'Pembelian PO supplier', '2026-10-17 02:00:00', '2026-10-17 02:00:00', '2026-10-17 02:00:00'),
(5, 1, 'out', -25.0000, 275.5000, 94570.0000, 2364250.0000, 'production', 'PRD-20261114-001', 'Pemakaian produksi', '2026-10-28 02:00:00', '2026-10-28 02:00:00', '2026-10-28 02:00:00'),
(6, 1, 'in', 70.0000, 345.5000, 96500.0000, 6755000.0000, 'purchase', 'PO-2026-0004', 'Pembelian PO supplier', '2026-11-10 02:00:00', '2026-11-10 02:00:00', '2026-11-10 02:00:00'),
(7, 1, 'out', -15.0000, 330.5000, 96500.0000, 1447500.0000, 'production', 'PRD-20261114-001', 'Pemakaian produksi', '2026-11-13 02:00:00', '2026-11-13 02:00:00', '2026-11-13 02:00:00'),
(8, 2, 'in', 208.0000, 208.0000, 97760.0000, 20334080.0000, 'purchase', 'PO-2026-0099', 'Stok awal gudang', '2026-08-11 03:07:00', '2026-08-11 03:07:00', '2026-08-11 03:07:00'),
(9, 2, 'out', -37.0000, 171.0000, 97760.0000, 3617120.0000, 'production', 'PRD-20261114-002', 'Pemakaian produksi', '2026-09-13 03:07:00', '2026-09-13 03:07:00', '2026-09-13 03:07:00'),
(10, 2, 'out', -27.0000, 144.0000, 97760.0000, 2639520.0000, 'production', 'PRD-20261114-002', 'Pemakaian produksi', '2026-10-04 03:07:00', '2026-10-04 03:07:00', '2026-10-04 03:07:00'),
(11, 2, 'in', 80.0000, 224.0000, 101920.0000, 8153600.0000, 'purchase', 'PO-2026-0032', 'Pembelian PO supplier', '2026-10-17 03:07:00', '2026-10-17 03:07:00', '2026-10-17 03:07:00'),
(12, 2, 'out', -31.0000, 193.0000, 101920.0000, 3159520.0000, 'production', 'PRD-20261114-002', 'Pemakaian produksi', '2026-10-28 03:07:00', '2026-10-28 03:07:00', '2026-10-28 03:07:00'),
(13, 2, 'in', 70.0000, 263.0000, 104000.0000, 7280000.0000, 'purchase', 'PO-2026-0008', 'Pembelian PO supplier', '2026-11-10 03:07:00', '2026-11-10 03:07:00', '2026-11-10 03:07:00'),
(14, 2, 'out', -19.0000, 244.0000, 104000.0000, 1976000.0000, 'production', 'PRD-20261114-002', 'Pemakaian produksi', '2026-11-13 03:07:00', '2026-11-13 03:07:00', '2026-11-13 03:07:00'),
(15, 3, 'in', 176.2500, 176.2500, 111390.0000, 19632487.5000, 'purchase', 'PO-2026-0103', 'Stok awal gudang', '2026-08-11 04:14:00', '2026-08-11 04:14:00', '2026-08-11 04:14:00'),
(16, 3, 'out', -44.0000, 132.2500, 111390.0000, 4901160.0000, 'production', 'PRD-20261114-003', 'Pemakaian produksi', '2026-09-13 04:14:00', '2026-09-13 04:14:00', '2026-09-13 04:14:00'),
(17, 3, 'out', -32.0000, 100.2500, 111390.0000, 3564480.0000, 'production', 'PRD-20261114-003', 'Pemakaian produksi', '2026-10-04 04:14:00', '2026-10-04 04:14:00', '2026-10-04 04:14:00'),
(18, 3, 'in', 80.0000, 180.2500, 116130.0000, 9290400.0000, 'purchase', 'PO-2026-0036', 'Pembelian PO supplier', '2026-10-17 04:14:00', '2026-10-17 04:14:00', '2026-10-17 04:14:00'),
(19, 3, 'out', -37.0000, 143.2500, 116130.0000, 4296810.0000, 'production', 'PRD-20261114-003', 'Pemakaian produksi', '2026-10-28 04:14:00', '2026-10-28 04:14:00', '2026-10-28 04:14:00'),
(20, 3, 'in', 70.0000, 213.2500, 118500.0000, 8295000.0000, 'purchase', 'PO-2026-0012', 'Pembelian PO supplier', '2026-11-10 04:14:00', '2026-11-10 04:14:00', '2026-11-10 04:14:00'),
(21, 3, 'out', -23.0000, 190.2500, 118500.0000, 2725500.0000, 'production', 'PRD-20261114-003', 'Pemakaian produksi', '2026-11-13 04:14:00', '2026-11-13 04:14:00', '2026-11-13 04:14:00'),
(22, 4, 'in', 232.0000, 232.0000, 64390.0000, 14938480.0000, 'purchase', 'PO-2026-0107', 'Stok awal gudang', '2026-08-11 05:21:00', '2026-08-11 05:21:00', '2026-08-11 05:21:00'),
(23, 4, 'out', -51.0000, 181.0000, 64390.0000, 3283890.0000, 'production', 'PRD-20261114-004', 'Pemakaian produksi', '2026-09-13 05:21:00', '2026-09-13 05:21:00', '2026-09-13 05:21:00'),
(24, 4, 'out', -37.0000, 144.0000, 64390.0000, 2382430.0000, 'production', 'PRD-20261114-004', 'Pemakaian produksi', '2026-10-04 05:21:00', '2026-10-04 05:21:00', '2026-10-04 05:21:00'),
(25, 4, 'in', 80.0000, 224.0000, 67130.0000, 5370400.0000, 'purchase', 'PO-2026-0040', 'Pembelian PO supplier', '2026-10-17 05:21:00', '2026-10-17 05:21:00', '2026-10-17 05:21:00'),
(26, 4, 'out', -43.0000, 181.0000, 67130.0000, 2886590.0000, 'production', 'PRD-20261114-004', 'Pemakaian produksi', '2026-10-28 05:21:00', '2026-10-28 05:21:00', '2026-10-28 05:21:00'),
(27, 4, 'in', 70.0000, 251.0000, 68500.0000, 4795000.0000, 'purchase', 'PO-2026-0016', 'Pembelian PO supplier', '2026-11-10 05:21:00', '2026-11-10 05:21:00', '2026-11-10 05:21:00'),
(28, 4, 'out', -15.0000, 236.0000, 68500.0000, 1027500.0000, 'production', 'PRD-20261114-004', 'Pemakaian produksi', '2026-11-13 05:21:00', '2026-11-13 05:21:00', '2026-11-13 05:21:00'),
(29, 5, 'in', 184.5000, 184.5000, 86480.0000, 15955560.0000, 'purchase', 'PO-2026-0111', 'Stok awal gudang', '2026-08-11 06:28:00', '2026-08-11 06:28:00', '2026-08-11 06:28:00'),
(30, 5, 'out', -58.0000, 126.5000, 86480.0000, 5015840.0000, 'production', 'PRD-20261114-005', 'Pemakaian produksi', '2026-09-13 06:28:00', '2026-09-13 06:28:00', '2026-09-13 06:28:00'),
(31, 5, 'out', -42.0000, 84.5000, 86480.0000, 3632160.0000, 'production', 'PRD-20261114-005', 'Pemakaian produksi', '2026-10-04 06:28:00', '2026-10-04 06:28:00', '2026-10-04 06:28:00'),
(32, 5, 'in', 80.0000, 164.5000, 90160.0000, 7212800.0000, 'purchase', 'PO-2026-0044', 'Pembelian PO supplier', '2026-10-17 06:28:00', '2026-10-17 06:28:00', '2026-10-17 06:28:00'),
(33, 5, 'out', -25.0000, 139.5000, 90160.0000, 2254000.0000, 'production', 'PRD-20261114-005', 'Pemakaian produksi', '2026-10-28 06:28:00', '2026-10-28 06:28:00', '2026-10-28 06:28:00'),
(34, 5, 'in', 70.0000, 209.5000, 92000.0000, 6440000.0000, 'purchase', 'PO-2026-0020', 'Pembelian PO supplier', '2026-11-10 06:28:00', '2026-11-10 06:28:00', '2026-11-10 06:28:00'),
(35, 5, 'out', -19.0000, 190.5000, 92000.0000, 1748000.0000, 'production', 'PRD-20261114-005', 'Pemakaian produksi', '2026-11-13 06:28:00', '2026-11-13 06:28:00', '2026-11-13 06:28:00'),
(36, 6, 'in', 151.0000, 151.0000, 73320.0000, 11071320.0000, 'purchase', 'PO-2026-0115', 'Stok awal gudang', '2026-08-11 07:35:00', '2026-08-11 07:35:00', '2026-08-11 07:35:00'),
(37, 6, 'out', -65.0000, 86.0000, 73320.0000, 4765800.0000, 'production', 'PRD-20261114-006', 'Pemakaian produksi', '2026-09-13 07:35:00', '2026-09-13 07:35:00', '2026-09-13 07:35:00'),
(38, 6, 'out', -22.0000, 64.0000, 73320.0000, 1613040.0000, 'production', 'PRD-20261114-006', 'Pemakaian produksi', '2026-10-04 07:35:00', '2026-10-04 07:35:00', '2026-10-04 07:35:00'),
(39, 6, 'in', 80.0000, 144.0000, 76440.0000, 6115200.0000, 'purchase', 'PO-2026-0048', 'Pembelian PO supplier', '2026-10-17 07:35:00', '2026-10-17 07:35:00', '2026-10-17 07:35:00'),
(40, 6, 'out', -31.0000, 113.0000, 76440.0000, 2369640.0000, 'production', 'PRD-20261114-006', 'Pemakaian produksi', '2026-10-28 07:35:00', '2026-10-28 07:35:00', '2026-10-28 07:35:00'),
(41, 6, 'in', 70.0000, 183.0000, 78000.0000, 5460000.0000, 'purchase', 'PO-2026-0024', 'Pembelian PO supplier', '2026-11-10 07:35:00', '2026-11-10 07:35:00', '2026-11-10 07:35:00'),
(42, 6, 'out', -23.0000, 160.0000, 78000.0000, 1794000.0000, 'production', 'PRD-20261114-006', 'Pemakaian produksi', '2026-11-13 07:35:00', '2026-11-13 07:35:00', '2026-11-13 07:35:00'),
(43, 7, 'in', 203.5000, 203.5000, 39480.0000, 8034180.0000, 'purchase', 'PO-2026-0119', 'Stok awal gudang', '2026-08-11 08:42:00', '2026-08-11 08:42:00', '2026-08-11 08:42:00'),
(44, 7, 'out', -30.0000, 173.5000, 39480.0000, 1184400.0000, 'production', 'PRD-20261114-007', 'Pemakaian produksi', '2026-09-13 08:42:00', '2026-09-13 08:42:00', '2026-09-13 08:42:00'),
(45, 7, 'out', -27.0000, 146.5000, 39480.0000, 1065960.0000, 'production', 'PRD-20261114-007', 'Pemakaian produksi', '2026-10-04 08:42:00', '2026-10-04 08:42:00', '2026-10-04 08:42:00'),
(46, 7, 'in', 80.0000, 226.5000, 41160.0000, 3292800.0000, 'purchase', 'PO-2026-0052', 'Pembelian PO supplier', '2026-10-17 08:42:00', '2026-10-17 08:42:00', '2026-10-17 08:42:00'),
(47, 7, 'out', -37.0000, 189.5000, 41160.0000, 1522920.0000, 'production', 'PRD-20261114-007', 'Pemakaian produksi', '2026-10-28 08:42:00', '2026-10-28 08:42:00', '2026-10-28 08:42:00'),
(48, 7, 'in', 70.0000, 259.5000, 42000.0000, 2940000.0000, 'purchase', 'PO-2026-0028', 'Pembelian PO supplier', '2026-11-10 08:42:00', '2026-11-10 08:42:00', '2026-11-10 08:42:00'),
(49, 7, 'out', -15.0000, 244.5000, 42000.0000, 630000.0000, 'production', 'PRD-20261114-007', 'Pemakaian produksi', '2026-11-13 08:42:00', '2026-11-13 08:42:00', '2026-11-13 08:42:00'),
(50, 8, 'in', 146.0000, 146.0000, 126900.0000, 18527400.0000, 'purchase', 'PO-2026-0123', 'Stok awal gudang', '2026-08-11 09:49:00', '2026-08-11 09:49:00', '2026-08-11 09:49:00'),
(51, 8, 'out', -37.0000, 109.0000, 126900.0000, 4695300.0000, 'production', 'PRD-20261114-008', 'Pemakaian produksi', '2026-09-13 09:49:00', '2026-09-13 09:49:00', '2026-09-13 09:49:00'),
(52, 8, 'out', -32.0000, 77.0000, 126900.0000, 4060800.0000, 'production', 'PRD-20261114-008', 'Pemakaian produksi', '2026-10-04 09:49:00', '2026-10-04 09:49:00', '2026-10-04 09:49:00'),
(53, 8, 'in', 80.0000, 157.0000, 132300.0000, 10584000.0000, 'purchase', 'PO-2026-0056', 'Pembelian PO supplier', '2026-10-17 09:49:00', '2026-10-17 09:49:00', '2026-10-17 09:49:00'),
(54, 8, 'out', -43.0000, 114.0000, 132300.0000, 5688900.0000, 'production', 'PRD-20261114-008', 'Pemakaian produksi', '2026-10-28 09:49:00', '2026-10-28 09:49:00', '2026-10-28 09:49:00'),
(55, 8, 'in', 70.0000, 184.0000, 135000.0000, 9450000.0000, 'purchase', 'PO-2026-0032', 'Pembelian PO supplier', '2026-11-10 09:49:00', '2026-11-10 09:49:00', '2026-11-10 09:49:00'),
(56, 8, 'out', -19.0000, 165.0000, 135000.0000, 2565000.0000, 'production', 'PRD-20261114-008', 'Pemakaian produksi', '2026-11-13 09:49:00', '2026-11-13 09:49:00', '2026-11-13 09:49:00'),
(57, 9, 'in', 162.0000, 162.0000, 175780.0000, 28476360.0000, 'purchase', 'PO-2026-0127', 'Stok awal gudang', '2026-08-11 02:56:00', '2026-08-11 02:56:00', '2026-08-11 02:56:00'),
(58, 9, 'out', -44.0000, 118.0000, 175780.0000, 7734320.0000, 'production', 'PRD-20261114-009', 'Pemakaian produksi', '2026-09-13 02:56:00', '2026-09-13 02:56:00', '2026-09-13 02:56:00'),
(59, 9, 'out', -37.0000, 81.0000, 175780.0000, 6503860.0000, 'production', 'PRD-20261114-009', 'Pemakaian produksi', '2026-10-04 02:56:00', '2026-10-04 02:56:00', '2026-10-04 02:56:00'),
(60, 9, 'in', 80.0000, 161.0000, 183260.0000, 14660800.0000, 'purchase', 'PO-2026-0060', 'Pembelian PO supplier', '2026-10-17 02:56:00', '2026-10-17 02:56:00', '2026-10-17 02:56:00'),
(61, 9, 'out', -25.0000, 136.0000, 183260.0000, 4581500.0000, 'production', 'PRD-20261114-009', 'Pemakaian produksi', '2026-10-28 02:56:00', '2026-10-28 02:56:00', '2026-10-28 02:56:00'),
(62, 9, 'in', 70.0000, 206.0000, 187000.0000, 13090000.0000, 'purchase', 'PO-2026-0036', 'Pembelian PO supplier', '2026-11-10 02:56:00', '2026-11-10 02:56:00', '2026-11-10 02:56:00'),
(63, 9, 'out', -23.0000, 183.0000, 187000.0000, 4301000.0000, 'production', 'PRD-20261114-009', 'Pemakaian produksi', '2026-11-13 02:56:00', '2026-11-13 02:56:00', '2026-11-13 02:56:00'),
(64, 10, 'in', 318.0000, 318.0000, 11750.0000, 3736500.0000, 'purchase', 'PO-2026-0131', 'Stok awal gudang', '2026-08-11 03:03:00', '2026-08-11 03:03:00', '2026-08-11 03:03:00'),
(65, 10, 'out', -51.0000, 267.0000, 11750.0000, 599250.0000, 'production', 'PRD-20261114-010', 'Pemakaian produksi', '2026-09-13 03:03:00', '2026-09-13 03:03:00', '2026-09-13 03:03:00'),
(66, 10, 'out', -42.0000, 225.0000, 11750.0000, 493500.0000, 'production', 'PRD-20261114-010', 'Pemakaian produksi', '2026-10-04 03:03:00', '2026-10-04 03:03:00', '2026-10-04 03:03:00'),
(67, 10, 'in', 80.0000, 305.0000, 12250.0000, 980000.0000, 'purchase', 'PO-2026-0064', 'Pembelian PO supplier', '2026-10-17 03:03:00', '2026-10-17 03:03:00', '2026-10-17 03:03:00'),
(68, 10, 'out', -31.0000, 274.0000, 12250.0000, 379750.0000, 'production', 'PRD-20261114-010', 'Pemakaian produksi', '2026-10-28 03:03:00', '2026-10-28 03:03:00', '2026-10-28 03:03:00'),
(69, 10, 'in', 70.0000, 344.0000, 12500.0000, 875000.0000, 'purchase', 'PO-2026-0040', 'Pembelian PO supplier', '2026-11-10 03:03:00', '2026-11-10 03:03:00', '2026-11-10 03:03:00'),
(70, 10, 'out', -15.0000, 329.0000, 12500.0000, 187500.0000, 'production', 'PRD-20261114-010', 'Pemakaian produksi', '2026-11-13 03:03:00', '2026-11-13 03:03:00', '2026-11-13 03:03:00'),
(71, 11, 'in', 177.0000, 177.0000, 25380.0000, 4492260.0000, 'purchase', 'PO-2026-0135', 'Stok awal gudang', '2026-08-11 04:10:00', '2026-08-11 04:10:00', '2026-08-11 04:10:00'),
(72, 11, 'out', -58.0000, 119.0000, 25380.0000, 1472040.0000, 'production', 'PRD-20261114-011', 'Pemakaian produksi', '2026-09-13 04:10:00', '2026-09-13 04:10:00', '2026-09-13 04:10:00'),
(73, 11, 'out', -22.0000, 97.0000, 25380.0000, 558360.0000, 'production', 'PRD-20261114-011', 'Pemakaian produksi', '2026-10-04 04:10:00', '2026-10-04 04:10:00', '2026-10-04 04:10:00'),
(74, 11, 'in', 80.0000, 177.0000, 26460.0000, 2116800.0000, 'purchase', 'PO-2026-0068', 'Pembelian PO supplier', '2026-10-17 04:10:00', '2026-10-17 04:10:00', '2026-10-17 04:10:00'),
(75, 11, 'out', -37.0000, 140.0000, 26460.0000, 979020.0000, 'production', 'PRD-20261114-011', 'Pemakaian produksi', '2026-10-28 04:10:00', '2026-10-28 04:10:00', '2026-10-28 04:10:00'),
(76, 11, 'in', 70.0000, 210.0000, 27000.0000, 1890000.0000, 'purchase', 'PO-2026-0044', 'Pembelian PO supplier', '2026-11-10 04:10:00', '2026-11-10 04:10:00', '2026-11-10 04:10:00'),
(77, 11, 'out', -19.0000, 191.0000, 27000.0000, 513000.0000, 'production', 'PRD-20261114-011', 'Pemakaian produksi', '2026-11-13 04:10:00', '2026-11-13 04:10:00', '2026-11-13 04:10:00'),
(78, 12, 'in', 505.0000, 505.0000, 6110.0000, 3085550.0000, 'purchase', 'PO-2026-0139', 'Stok awal gudang', '2026-08-11 05:17:00', '2026-08-11 05:17:00', '2026-08-11 05:17:00'),
(79, 12, 'out', -65.0000, 440.0000, 6110.0000, 397150.0000, 'production', 'PRD-20261114-012', 'Pemakaian produksi', '2026-09-13 05:17:00', '2026-09-13 05:17:00', '2026-09-13 05:17:00'),
(80, 12, 'out', -27.0000, 413.0000, 6110.0000, 164970.0000, 'production', 'PRD-20261114-012', 'Pemakaian produksi', '2026-10-04 05:17:00', '2026-10-04 05:17:00', '2026-10-04 05:17:00'),
(81, 12, 'in', 80.0000, 493.0000, 6370.0000, 509600.0000, 'purchase', 'PO-2026-0072', 'Pembelian PO supplier', '2026-10-17 05:17:00', '2026-10-17 05:17:00', '2026-10-17 05:17:00'),
(82, 12, 'out', -43.0000, 450.0000, 6370.0000, 273910.0000, 'production', 'PRD-20261114-012', 'Pemakaian produksi', '2026-10-28 05:17:00', '2026-10-28 05:17:00', '2026-10-28 05:17:00'),
(83, 12, 'in', 70.0000, 520.0000, 6500.0000, 455000.0000, 'purchase', 'PO-2026-0048', 'Pembelian PO supplier', '2026-11-10 05:17:00', '2026-11-10 05:17:00', '2026-11-10 05:17:00'),
(84, 12, 'out', -23.0000, 497.0000, 6500.0000, 149500.0000, 'production', 'PRD-20261114-012', 'Pemakaian produksi', '2026-11-13 05:17:00', '2026-11-13 05:17:00', '2026-11-13 05:17:00'),
(85, 13, 'in', 1570.0000, 1570.0000, 799.0000, 1254430.0000, 'purchase', 'PO-2026-0143', 'Stok awal gudang', '2026-08-11 06:24:00', '2026-08-11 06:24:00', '2026-08-11 06:24:00'),
(86, 13, 'out', -30.0000, 1540.0000, 799.0000, 23970.0000, 'production', 'PRD-20261114-013', 'Pemakaian produksi', '2026-09-13 06:24:00', '2026-09-13 06:24:00', '2026-09-13 06:24:00'),
(87, 13, 'out', -32.0000, 1508.0000, 799.0000, 25568.0000, 'production', 'PRD-20261114-013', 'Pemakaian produksi', '2026-10-04 06:24:00', '2026-10-04 06:24:00', '2026-10-04 06:24:00'),
(88, 13, 'in', 80.0000, 1588.0000, 833.0000, 66640.0000, 'purchase', 'PO-2026-0076', 'Pembelian PO supplier', '2026-10-17 06:24:00', '2026-10-17 06:24:00', '2026-10-17 06:24:00'),
(89, 13, 'out', -25.0000, 1563.0000, 833.0000, 20825.0000, 'production', 'PRD-20261114-013', 'Pemakaian produksi', '2026-10-28 06:24:00', '2026-10-28 06:24:00', '2026-10-28 06:24:00'),
(90, 13, 'in', 70.0000, 1633.0000, 850.0000, 59500.0000, 'purchase', 'PO-2026-0052', 'Pembelian PO supplier', '2026-11-10 06:24:00', '2026-11-10 06:24:00', '2026-11-10 06:24:00'),
(91, 13, 'out', -15.0000, 1618.0000, 850.0000, 12750.0000, 'production', 'PRD-20261114-013', 'Pemakaian produksi', '2026-11-13 06:24:00', '2026-11-13 06:24:00', '2026-11-13 06:24:00'),
(92, 14, 'in', 400.0000, 400.0000, 3948.0000, 1579200.0000, 'purchase', 'PO-2026-0147', 'Stok awal gudang', '2026-08-11 07:31:00', '2026-08-11 07:31:00', '2026-08-11 07:31:00'),
(93, 14, 'out', -37.0000, 363.0000, 3948.0000, 146076.0000, 'production', 'PRD-20261114-014', 'Pemakaian produksi', '2026-09-13 07:31:00', '2026-09-13 07:31:00', '2026-09-13 07:31:00'),
(94, 14, 'out', -37.0000, 326.0000, 3948.0000, 146076.0000, 'production', 'PRD-20261114-014', 'Pemakaian produksi', '2026-10-04 07:31:00', '2026-10-04 07:31:00', '2026-10-04 07:31:00'),
(95, 14, 'in', 80.0000, 406.0000, 4116.0000, 329280.0000, 'purchase', 'PO-2026-0080', 'Pembelian PO supplier', '2026-10-17 07:31:00', '2026-10-17 07:31:00', '2026-10-17 07:31:00'),
(96, 14, 'out', -31.0000, 375.0000, 4116.0000, 127596.0000, 'production', 'PRD-20261114-014', 'Pemakaian produksi', '2026-10-28 07:31:00', '2026-10-28 07:31:00', '2026-10-28 07:31:00'),
(97, 14, 'in', 70.0000, 445.0000, 4200.0000, 294000.0000, 'purchase', 'PO-2026-0056', 'Pembelian PO supplier', '2026-11-10 07:31:00', '2026-11-10 07:31:00', '2026-11-10 07:31:00'),
(98, 14, 'out', -19.0000, 426.0000, 4200.0000, 79800.0000, 'production', 'PRD-20261114-014', 'Pemakaian produksi', '2026-11-13 07:31:00', '2026-11-13 07:31:00', '2026-11-13 07:31:00');

-- --------------------------------------------------------

--
-- Table structure for table `registration_challenges`
--

CREATE TABLE `registration_challenges` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `firebase_uid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `otp_challenge_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `metadata` json DEFAULT NULL,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `registration_challenges`
--

INSERT INTO `registration_challenges` (`id`, `email`, `name`, `password_hash`, `phone`, `firebase_uid`, `avatar`, `otp_challenge_id`, `ip_address`, `user_agent`, `metadata`, `expires_at`, `created_at`, `updated_at`, `deleted_at`) VALUES
('43a98fcd-c27d-41a1-8f08-ed488018926c', 'akbarfahlevy39@gmail.com', 'Mochammad Rachman Akbar Fahlevy', '$2y$12$COt4m/7c5ivLwSBYGlLfPen.UZVJ.jDQQk2aPTD3JfQ5cFTjtmDs2', NULL, NULL, NULL, '2fb52619-d321-46fc-a5ec-773d40d544a1', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36', '\"{\\\"initiated_at\\\":\\\"2026-11-14T10:58:19.382310Z\\\"}\"', '2026-11-14 04:08:19', '2026-11-14 03:58:19', '2026-11-14 03:58:19', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_by` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `description`, `is_active`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'admin', 'Administrator/pemilik toko Fashionku (operator tunggal)', 1, NULL, NULL, '2026-11-14 02:23:41', '2026-11-14 02:23:41', NULL),
(2, 'buyer', 'Pembeli Fashionku', 1, NULL, NULL, '2026-11-14 02:23:41', '2026-11-14 02:23:41', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `role_id` bigint UNSIGNED NOT NULL,
  `permission_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role_permissions`
--

INSERT INTO `role_permissions` (`role_id`, `permission_id`, `created_at`, `updated_at`) VALUES
(1, 1, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(1, 2, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(1, 3, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(1, 4, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(1, 5, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(1, 6, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(1, 8, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(1, 9, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(1, 10, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(1, 11, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(1, 12, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(1, 13, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(1, 14, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(1, 15, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(1, 16, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(1, 17, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(1, 18, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(2, 5, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(2, 7, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(2, 11, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(2, 13, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
(2, 15, '2026-11-14 02:23:41', '2026-11-14 02:23:41');

-- --------------------------------------------------------

--
-- Table structure for table `schedules`
--

CREATE TABLE `schedules` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'todo',
  `position` int UNSIGNED NOT NULL DEFAULT '0',
  `assignee` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `label` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `priority` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'normal',
  `color` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#10B981',
  `date` date NOT NULL,
  `capacity` int UNSIGNED NOT NULL DEFAULT '1',
  `recurrence` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'none',
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `is_all_day` tinyint(1) NOT NULL DEFAULT '0',
  `is_completed` tinyint(1) NOT NULL DEFAULT '0',
  `completed_at` timestamp NULL DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `completion_proof` json DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_by` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `schedules`
--

INSERT INTO `schedules` (`id`, `user_id`, `title`, `description`, `type`, `status`, `position`, `assignee`, `label`, `priority`, `color`, `date`, `capacity`, `recurrence`, `start_time`, `end_time`, `is_all_day`, `is_completed`, `completed_at`, `metadata`, `completion_proof`, `is_active`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'Packing & serahkan pesanan ke kurir', NULL, 'order', 'in_progress', 0, 'Tim packing', 'Operasional', 'high', '#10B981', '2026-11-14', 1, 'none', '09:00:00', '11:00:00', 0, 0, NULL, '{\"seeded\": true}', NULL, 1, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-09 02:00:00', '2026-11-14 02:24:37', NULL),
(2, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'Restock katun combed 24s ke supplier', 'Cek fisik stok, catat selisih, lalu sesuaikan di menu inventory.', 'inventory', 'todo', 1, 'Nadia', 'Gudang', 'high', '#F59E0B', '2026-11-14', 1, 'none', '13:00:00', '15:00:00', 0, 0, NULL, '{\"seeded\": true}', NULL, 1, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-09 02:00:00', '2026-11-14 02:24:37', NULL),
(3, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'Balas chat & keluhan pembeli', NULL, 'support', 'todo', 2, 'Rafi', 'CS', 'normal', '#3B82F6', '2026-11-14', 1, 'none', '16:00:00', '17:00:00', 0, 0, NULL, '{\"seeded\": true}', NULL, 1, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-09 02:00:00', '2026-11-14 02:24:37', NULL),
(4, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'Foto koleksi outerwear Desember', NULL, 'content', 'todo', 3, 'Tim konten', 'Konten', 'normal', '#8B5CF6', '2026-11-15', 1, 'none', '10:00:00', '14:00:00', 0, 1, '2026-11-15 10:00:00', '{\"seeded\": true}', NULL, 1, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-09 02:00:00', '2026-11-14 02:24:37', NULL),
(5, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'Meeting supplier konveksi batch baru', NULL, 'meeting', 'todo', 4, 'Nadia', 'Produksi', 'high', '#EF4444', '2026-11-16', 1, 'none', '14:00:00', '15:30:00', 0, 0, NULL, '{\"seeded\": true}', NULL, 1, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-09 02:00:00', '2026-11-14 02:24:37', NULL),
(6, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'Stock opname gudang & packaging', 'Cek fisik stok, catat selisih, lalu sesuaikan di menu inventory.', 'inventory', 'todo', 5, 'Tim gudang', 'Gudang', 'normal', '#F59E0B', '2026-11-17', 1, 'none', '08:00:00', '12:00:00', 0, 0, NULL, '{\"seeded\": true}', NULL, 1, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-09 02:00:00', '2026-11-14 02:24:37', NULL),
(7, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'Rekap penjualan & laporan mingguan', NULL, 'finance', 'done', 6, 'Nadia', 'Keuangan', 'normal', '#10B981', '2026-11-13', 1, 'none', '16:00:00', '17:30:00', 0, 1, '2026-11-13 10:00:00', '{\"seeded\": true}', NULL, 1, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-09 02:00:00', '2026-11-14 02:24:37', NULL),
(8, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'Upload produk baru ke katalog', NULL, 'content', 'done', 7, 'Rafi', 'Konten', 'normal', '#8B5CF6', '2026-11-12', 1, 'none', '11:00:00', '13:00:00', 0, 1, '2026-11-12 10:00:00', '{\"seeded\": true}', NULL, 1, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-09 02:00:00', '2026-11-14 02:24:37', NULL),
(9, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'Cek kualitas retur barang', NULL, 'other', 'todo', 8, 'Tim gudang', 'Gudang', 'low', '#6B7280', '2026-11-18', 1, 'none', '09:00:00', '10:00:00', 0, 0, NULL, '{\"seeded\": true}', NULL, 1, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-09 02:00:00', '2026-11-14 02:24:37', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `security_events`
--

CREATE TABLE `security_events` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `event_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `purpose` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `severity` enum('info','warning','critical') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'info',
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `metadata` json DEFAULT NULL,
  `success` tinyint(1) NOT NULL DEFAULT '1',
  `failure_reason` text COLLATE utf8mb4_unicode_ci,
  `occurred_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `security_events`
--

INSERT INTO `security_events` (`id`, `user_id`, `email`, `event_type`, `purpose`, `severity`, `ip_address`, `user_agent`, `metadata`, `success`, `failure_reason`, `occurred_at`, `created_at`, `updated_at`, `deleted_at`) VALUES
('09f5dd30-c6e6-4d14-929b-b3b3aa3a8737', NULL, 'akbarfahlevy39@gmail.com', 'otp_issued', 'register', 'info', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36', '{\"challenge_id\": \"2fb52619-d321-46fc-a5ec-773d40d544a1\", \"registration_challenge_id\": \"43a98fcd-c27d-41a1-8f08-ed488018926c\"}', 1, NULL, '2026-11-14 03:58:48', '2026-11-14 03:58:48', '2026-11-14 03:58:48', NULL),
('f19bdb3e-f09c-47a1-9b7b-9008149dd1e6', '7c5ee92d-2adf-4963-9a6e-9dc1ff30be6f', 'akbarfahlevy39@gmail.com', 'otp_issued', 'google_login', 'info', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36', '{\"role\": \"buyer\", \"login_type\": \"google\", \"device_name\": \"marketplace-web-buyer\"}', 1, NULL, '2026-11-14 04:00:38', '2026-11-14 04:00:38', '2026-11-14 04:00:38', NULL),
('f2bcf737-cb6c-4ca4-8a72-dea9ba2c400f', NULL, 'akbarfahlevy39@gmail.com', 'otp_issued', 'register', 'info', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36', '{\"challenge_id\": \"2fb52619-d321-46fc-a5ec-773d40d544a1\", \"registration_challenge_id\": \"43a98fcd-c27d-41a1-8f08-ed488018926c\"}', 1, NULL, '2026-11-14 03:58:19', '2026-11-14 03:58:19', '2026-11-14 03:58:19', NULL),
('f36d4eee-709a-44d3-b29d-0e63f6f8e246', '7c5ee92d-2adf-4963-9a6e-9dc1ff30be6f', 'akbarfahlevy39@gmail.com', 'otp_issued', 'google_login', 'info', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36', '{\"role\": \"buyer\", \"login_type\": \"google\", \"device_name\": \"marketplace-web-buyer\"}', 1, NULL, '2026-11-14 04:01:43', '2026-11-14 04:01:43', '2026-11-14 04:01:43', NULL),
('f8dff432-8bef-4c4e-bc87-270e93b6737c', NULL, 'akbarfahlevy39@gmail.com', 'otp_issued', 'register', 'info', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36', '{\"challenge_id\": \"2fb52619-d321-46fc-a5ec-773d40d544a1\", \"registration_challenge_id\": \"43a98fcd-c27d-41a1-8f08-ed488018926c\"}', 1, NULL, '2026-11-14 03:59:02', '2026-11-14 03:59:02', '2026-11-14 03:59:02', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `seller_customers`
--

CREATE TABLE `seller_customers` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `note` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_by` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `seller_customers`
--

INSERT INTO `seller_customers` (`id`, `user_id`, `note`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 'abe56782-bb24-c759-25f7-e09751e8d336', 'Pelanggan reguler, sering repeat order', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-17 00:12:02', '2026-11-14 02:24:02'),
(2, 'c323571d-d64c-f97c-2808-140d3610f2eb', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-15 22:01:02', '2026-11-14 02:24:02'),
(3, '89a52d76-3cfc-c24c-cb98-21a4a56adbda', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-14 19:50:02', '2026-11-14 02:24:02'),
(4, 'c9858af3-80a2-1b07-293a-da94c650ac94', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-13 17:39:02', '2026-11-14 02:24:02'),
(5, '37fcb800-49bf-9dbf-c867-fc9d233699c1', 'Pelanggan reguler, sering repeat order', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-12 15:28:02', '2026-11-14 02:24:02'),
(6, '01e1e35a-187c-d961-58ca-25d230056614', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-11 13:17:02', '2026-11-14 02:24:02'),
(7, 'adae9f8e-378d-b2a2-3122-70eb31a99996', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-10 11:06:02', '2026-11-14 02:24:02'),
(8, '20d503c5-6e99-eb51-0cbd-2725f7e2e876', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-09 08:55:02', '2026-11-14 02:24:02'),
(9, 'dc41400c-122c-90f0-d943-48a55f6f9abd', 'Pelanggan reguler, sering repeat order', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-08 06:44:02', '2026-11-14 02:24:02'),
(10, '0fa38f39-7c4b-b50a-4de5-5843c793c295', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-07 04:33:02', '2026-11-14 02:24:02'),
(11, '847439d3-e0dd-ae2f-0ee8-9a07860386bd', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-06 02:22:02', '2026-11-14 02:24:02'),
(12, '0dc38b96-2c45-1fef-1143-7c08e97cf3cf', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-05 00:11:02', '2026-11-14 02:24:02'),
(13, '68cea60f-963e-3cf9-2f5d-579d2cffe41b', 'Pelanggan reguler, sering repeat order', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-03 22:00:02', '2026-11-14 02:24:02'),
(14, 'd1158e10-1fb5-8d0b-7ab2-b5ad00354462', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-02 19:49:02', '2026-11-14 02:24:02'),
(15, 'fb358165-f121-342b-620b-53a635217b97', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-01 17:38:02', '2026-11-14 02:24:02'),
(16, 'c5d9f141-2619-5ce4-055c-a13b1b030640', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-09-30 15:27:02', '2026-11-14 02:24:02'),
(17, '8f90ee9c-9303-a25d-6d77-f711e7ef84e6', 'Pelanggan reguler, sering repeat order', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-09-29 13:16:02', '2026-11-14 02:24:02'),
(18, '4fe4a5a9-ca82-3950-aa71-8f06a919f0bf', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-09-28 11:05:02', '2026-11-14 02:24:02'),
(19, '97cec183-eea2-5e70-1751-2819621fdbf2', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-09-27 08:54:02', '2026-11-14 02:24:02'),
(20, '4920f24e-514f-e2cd-08c0-3adf50220e53', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-09-26 06:43:02', '2026-11-14 02:24:02'),
(21, 'be1f7f6c-786f-886f-70fd-1adf76c06110', 'Pelanggan reguler, sering repeat order', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-09-25 04:32:02', '2026-11-14 02:24:02'),
(22, '83fcef72-cc4f-747a-ee98-7ca1bbda04f9', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-09-24 02:21:02', '2026-11-14 02:24:02'),
(23, '8234251c-184e-4d14-e02b-63b6b5869842', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-09-23 00:10:02', '2026-11-14 02:24:02'),
(24, 'dcf53c7b-7960-20e7-e37b-ce04efcd9d31', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-09-21 21:59:02', '2026-11-14 02:24:02'),
(25, '8769c09a-cfd0-0292-f0c8-30b58bf4f1d5', 'Pelanggan reguler, sering repeat order', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-09-20 19:48:02', '2026-11-14 02:24:02'),
(26, '331429a9-ba63-a268-3e5d-49912a26b5df', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-09-19 17:37:02', '2026-11-14 02:24:02'),
(27, '03d879fa-ea37-16e7-0382-d9e05bce0ea0', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-09-18 15:26:02', '2026-11-14 02:24:02'),
(28, 'ab398d16-9f7d-2929-aa2b-13f81d78d085', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-09-17 13:15:02', '2026-11-14 02:24:02'),
(29, 'dcaf3e0f-c3e0-3dd6-e158-cca1ec2560ad', 'Pelanggan reguler, sering repeat order', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-09-16 11:04:02', '2026-11-14 02:24:02'),
(30, 'a59b13c6-da0d-cc36-aa08-7fdb038f3e7a', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-09-15 08:53:02', '2026-11-14 02:24:02'),
(31, 'b430a205-e6c4-f1a2-dd01-89b5c8728d3f', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-09-14 06:42:02', '2026-11-14 02:24:02'),
(32, '32dc5cb6-dfa4-d861-17b7-16128391058c', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-09-13 04:31:02', '2026-11-14 02:24:02'),
(33, 'eb50c71c-58bf-77e2-f3b9-920c25108c95', 'Pelanggan reguler, sering repeat order', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-09-12 02:20:02', '2026-11-14 02:24:02'),
(34, 'b1bd0bd7-5142-a51a-9155-576acb2bc84e', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-09-11 00:09:02', '2026-11-14 02:24:02'),
(35, 'dd1ecb58-65a6-92bf-dd73-2f17941c977b', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-09-09 21:58:02', '2026-11-14 02:24:02'),
(36, '3509673a-1d35-b0b9-594c-ff9f3e19b2a9', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-09-08 19:47:02', '2026-11-14 02:24:02'),
(37, '4999ee98-9d2f-16b5-4e45-782a5cbc2e18', 'Pelanggan reguler, sering repeat order', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-12 08:08:02', '2026-11-14 02:24:02'),
(38, 'fd1a4098-c0e9-2f33-f52d-b2b92cef814c', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-12 05:51:02', '2026-11-14 02:24:02'),
(39, '5570cce1-49a1-d137-3658-ff2640f2c112', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-12 03:34:02', '2026-11-14 02:24:02'),
(40, 'b4844148-08c8-975a-6f83-f4eddd7fa28a', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-12 01:17:02', '2026-11-14 02:24:02'),
(41, 'ddc8ad23-f5d1-dbc4-0919-7a0eb049e67c', 'Pelanggan reguler, sering repeat order', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-11 23:00:02', '2026-11-14 02:24:02'),
(42, 'dff1ab85-91bd-f4a1-f36c-a62f6c2ce82e', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-11 20:43:02', '2026-11-14 02:24:02'),
(43, 'accc1906-fb5d-6efc-24ed-0e0fb269c69e', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-11 18:26:02', '2026-11-14 02:24:02'),
(44, '74e3c558-0560-b63b-ba00-8a01fc6af72a', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-11 16:09:02', '2026-11-14 02:24:02'),
(45, 'e770f616-1223-c4da-de7b-e82721d80c40', 'Pelanggan reguler, sering repeat order', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-11 13:52:02', '2026-11-14 02:24:02'),
(46, '2c230d3d-c8f6-ebf9-80d8-9238d4f2941a', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-11 11:35:02', '2026-11-14 02:24:02'),
(47, '74266d05-6397-1296-991e-3d76c6ad9122', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-11 09:18:02', '2026-11-14 02:24:02'),
(48, '266fa5bb-8cc7-149a-46d9-09d1f0c8fe90', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-11 07:01:02', '2026-11-14 02:24:02'),
(49, '76fe5857-9fc0-e31b-449f-0ec9892d2459', 'Pelanggan reguler, sering repeat order', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-11 04:44:02', '2026-11-14 02:24:02'),
(50, '17aa9f53-81c1-7db5-a094-14b0cae5d4f2', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-11 02:27:02', '2026-11-14 02:24:02'),
(51, 'e237eb66-fa74-3577-7aed-437a8db49b60', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-11 00:10:02', '2026-11-14 02:24:02'),
(52, 'cf1106a3-b582-6454-caed-c4b9d720bdcd', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-10 21:53:02', '2026-11-14 02:24:02'),
(53, '4937a1c4-62c8-5d35-3433-527614265df0', 'Pelanggan reguler, sering repeat order', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-10 02:24:02', '2026-11-14 02:24:02'),
(54, '2f5b0694-e364-f9bd-e445-034953d50131', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-09 20:53:02', '2026-11-14 02:24:02'),
(55, '568ac464-063b-302b-c6f0-9a384b93f540', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-09 15:22:02', '2026-11-14 02:24:02'),
(56, 'cb8dbbb2-6e48-067a-4c9e-e8cfd2d385cb', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-09 09:51:02', '2026-11-14 02:24:02'),
(57, '5e73f21e-65ff-583e-b0b2-49790262bd99', 'Pelanggan reguler, sering repeat order', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-09 04:20:02', '2026-11-14 02:24:02'),
(58, '20fea1be-a8f1-ea19-daa2-891de5e06685', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-08 22:49:02', '2026-11-14 02:24:02'),
(59, '4a41bf20-08d0-3256-2da1-473d2df9332d', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-08 17:18:02', '2026-11-14 02:24:02'),
(60, 'a61ecb87-2715-a57d-a602-f41571558b3e', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-08 11:47:02', '2026-11-14 02:24:02'),
(61, 'ecb48677-ccbf-7d3d-76fd-8944218e0781', 'Pelanggan reguler, sering repeat order', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-08 06:16:02', '2026-11-14 02:24:02'),
(62, 'fb22fb2e-476d-d51c-8f73-08aa30e70f4b', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-08 00:45:02', '2026-11-14 02:24:02'),
(63, '581c734e-1148-d4a2-2ba7-f6d32cc31d0f', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-07 19:14:02', '2026-11-14 02:24:02'),
(64, '028f8278-dfa1-4d9d-a2fb-eddd26813921', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-07 13:43:02', '2026-11-14 02:24:02'),
(65, '36333497-c72b-06cc-4875-815d9af60356', 'Pelanggan reguler, sering repeat order', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-07 08:12:02', '2026-11-14 02:24:02'),
(66, '87ee7bc6-865f-4f03-f910-a1d267178717', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-07 02:41:02', '2026-11-14 02:24:02'),
(67, 'c867f90f-7824-10fe-2aa3-2359ffe920a3', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-06 21:10:02', '2026-11-14 02:24:02'),
(68, '3dbd1354-8f7a-40b0-6247-23fcd4c8f491', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-06 15:39:02', '2026-11-14 02:24:02'),
(69, '8c0d42e6-e169-f777-614c-4c86da4b386d', 'Pelanggan reguler, sering repeat order', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-06 10:08:02', '2026-11-14 02:24:02'),
(70, '1b27d6c4-11e9-13d0-67d2-810e998376cc', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-06 04:37:02', '2026-11-14 02:24:02'),
(71, 'd741cf38-85e7-6fdc-bfb4-e9f01fa0ac4a', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-05 23:06:02', '2026-11-14 02:24:02'),
(72, '53c58789-9a09-c2a9-e0cd-c840a7530ddb', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-05 17:35:02', '2026-11-14 02:24:02'),
(73, '865931e8-2cc7-befe-d1a4-40f2184e8564', 'Pelanggan reguler, sering repeat order', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-05 12:04:02', '2026-11-14 02:24:02'),
(74, '8422156d-3226-4379-1db3-86d8a6f18a5e', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-05 06:33:02', '2026-11-14 02:24:02'),
(75, 'd6279585-7e9d-a7d9-50b8-d20071ff20d5', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-05 01:02:02', '2026-11-14 02:24:02'),
(76, '49be2788-69c8-d175-966e-a15bfc44a012', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-04 19:31:02', '2026-11-14 02:24:02'),
(77, '6fbb8c86-9231-b8a1-88d3-646663652350', 'Pelanggan reguler, sering repeat order', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-04 14:00:02', '2026-11-14 02:24:02'),
(78, 'c0d89002-20de-8855-3335-a6eb7ec4038f', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-04 08:29:02', '2026-11-14 02:24:02'),
(79, '3b0b84b6-6ba3-0c40-a16d-a075b449aa0d', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-04 02:58:02', '2026-11-14 02:24:02'),
(80, 'bf03fbce-d1d2-7300-136d-f61e4acdbe91', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-03 21:27:02', '2026-11-14 02:24:02'),
(81, '1e269f2c-8386-1ef0-ff8e-1494bf3746a3', 'Pelanggan reguler, sering repeat order', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-03 15:56:02', '2026-11-14 02:24:02'),
(82, '05ae4bc5-19bf-91e6-d6d6-f78747261a7f', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-03 10:25:02', '2026-11-14 02:24:02'),
(83, '62846adc-59a0-1459-ca7b-6d67b7cb98bb', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-03 04:54:02', '2026-11-14 02:24:02'),
(84, 'dee09934-26d8-29d8-36e1-1781d5de4a77', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-02 23:23:02', '2026-11-14 02:24:02'),
(85, '3321e0dd-e12f-8a1a-db98-d2bc759a8436', 'Pelanggan reguler, sering repeat order', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-30 02:24:02', '2026-11-14 02:24:02'),
(86, '3221a57c-2610-e0e3-593c-6b7c8f444086', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-29 00:13:02', '2026-11-14 02:24:02'),
(87, '487eb68d-0b76-e01a-b043-b572294cd606', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-27 22:02:02', '2026-11-14 02:24:02'),
(88, '38a478fc-af46-dab9-a7f9-ebe250220e5c', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-26 19:51:02', '2026-11-14 02:24:02'),
(89, '306cd17b-c0d6-b1b1-cf06-11f5c3ebfabc', 'Pelanggan reguler, sering repeat order', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-25 17:40:02', '2026-11-14 02:24:02'),
(90, '0112d875-50e7-9f82-e3db-8b236203ae0c', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-24 15:29:02', '2026-11-14 02:24:02'),
(91, '83981746-29d9-2a4e-4c3d-45ae19bcb789', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-23 13:18:02', '2026-11-14 02:24:02'),
(92, 'a83143c9-3367-62a4-1a5c-d250674a1646', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-22 11:07:02', '2026-11-14 02:24:02'),
(93, '7bdd6f0a-3f48-e6e8-ee16-ec8e84ff19ca', 'Pelanggan reguler, sering repeat order', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-21 08:56:02', '2026-11-14 02:24:02'),
(94, 'e61c80b0-3705-187e-58b5-70d1edb6ed8f', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-20 06:45:02', '2026-11-14 02:24:02'),
(95, '6523275d-f48d-41a5-0d49-72d139ce2711', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-19 04:34:02', '2026-11-14 02:24:02'),
(96, '777afe4c-4837-d716-a13c-846e9cd8cd7a', 'Pelanggan marketplace', 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-10-18 02:23:02', '2026-11-14 02:24:02');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('0m9VPhiMWQJX7kFz0DYnfnZYE8yA0LFnmhzuL1SY', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJCcGJNSDBaS1JQUG90dlpkN0xwS0hTWGNVYjdXOWd5aFRuOW1Ja3ZWIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794648533),
('0WOnQO0MrbqxIhHBu3J2K81Y2ReNmpIcCgzS0gnn', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJVMmxVMWpDM29CZFAxdUFpbGFHb2I5Mk0xcVBSdnhxRzkxeUZkQjFnIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794649541),
('1x5Gy8dkdWTIImfnYpzl7iCOflN9vzJix1wZxOcV', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiIzMWRPNUlQTUhRZk1zaGxzbzV3VmZKb1IycE5Ua2tyRFE4Sks3Z1BTIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794648339),
('2axGy5gy2HTV2jXBXtxTZloUpm8YvfsNX4XrdS3d', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJsQUNYYnZDS0liSDBJSGU0cHZqT0txWFpxZ213a1hMOE5qaENleDBQIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794649117),
('3T4bBCQ22UW36AXcwClZSubCcqH0hqeYWsZLUw1Y', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJKWDJ3dXlNU1l0Mld3cnBlVktYUUN1eFNLeXJiTUdVckoxTDY0R05PIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794648699),
('4MoNa8H1ISDtYsMlfe342J2XXPoi1RvOmEkXIYFh', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJrMHZ5RVBXcFowUkZhRzFxT2JSUWdMbElSdTlqUUdxb1NWd1NlcEpNIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794648602),
('5wF1GWNeofmUmq9H1DKZYNPgYeIbC9w8fS8wuOGX', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJVN3pFbFRPR0JaUjFtZEx1YjQ2VGttZmdWeFVHMEF3NWNSOU1NdkdpIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794648437),
('6uxLHDmFAMAxr3HMZBP1LARDzDFYUc5heb3rn4if', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJMWkpVaGJ1SjF5VXFSQXZVYmVGN28xc3NldVhteU9YUzJLU1lxT29OIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794648700),
('7awluY74bPu6GjRoXsR6owDO0XzPwLgjm2VBkepY', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiI4WkFhSVRDcGxsc1hRV01Sa0t4U1hHd0lpNVdtY0htSVV4cDdzczFMIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794648958),
('7kxMPqgNbWJIllp8dMncsmVGADT0FGsrnytoZQdi', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJVWWtzN096M1l3WWVNcVVlbFpoaDdBWUx5WFlUQldnSzh5YmRqWVVVIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794649801),
('7SwqNFauiDgmQL9OJTJq9JnJoERMju309iY1l63C', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJtWUJDbW41TlpmVGxFbUlmNm9SUVVKYUtUR1NESkVDYWlPQTY1cXJaIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794648796),
('7vNL9Ab5Kfms2RE6QHoBSJHSQ8pbIpqJQHcoTtN7', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJ0MXRoR0ZiZ2tuSUFDVklBWkRtRDd2U043aUtBamw1RlZaT3Q3OEFtIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794648891),
('81cZP360r9rVDQws0R5RXU3YykdTu5AewjTLOCrL', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiIyMEJsUGVYN3pRWlY0aEYxTGphWDhpVGhWcDM5azVXNGdPdzlmOUkyIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794648372),
('8hNUbgiueUER2GQiZNlU0NL1azjAuxdVeFWxd8u7', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJvdGR2UWZVa1pOZUJWdnc2cGl2T3Zlbno3dkhNWlQ5UlFGTW1UODV0IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC8ud2VsbC1rbm93blwvYXBwc3BlY2lmaWNcL2NvbS5jaHJvbWUuZGV2dG9vbHMuanNvbiIsInJvdXRlIjpudWxsfSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1794743214),
('9xg8RYaSxoaxmgkzuOO061cEikQj5DaSwtpFI3xP', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJEQ2czcVY0cWszTmdycVVVYzRTd0ZtOGtRMG41TzkxZ3F0ZkJodEZnIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794648240),
('9xnQVi7DP8GGBvw1NNjzKM18zm38wDAmSmltLmND', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJ5Z2g2dWVGM0NqSzFJMnBPUDdYeXoyb2Y2a3dsM0dlRmVkYVV1Y3RpIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794649116),
('AFLxPp71HqNSIZK6Noem4molmedVw8Txp7fytZoG', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJ1UG11dDdJalFoU3pveHloTjNxY3R6Sm90eENrWVIxR3pFaTBCZ3o1IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794649866),
('aow9b9mB87k6ulRXtj6fZuJlv7Kk8D6OjtFfh2Y2', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJIVjVLS3JmTjVlVU1PaHFnWXkzdlp3azNES0hJY3VVbHVkSGgyWEthIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794649572),
('asjf54tC5xJuO48y9fxcfosaKtA5lGmwZPFgIHfw', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiIxSGlsQ3RPVmdFZkdYR3ZpSFBQelRNT1M5cDJXV2x5RWl4N3dXVEJxIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794649705),
('AsqXO2ZAHZR1KHXgOdWYsfdWkWlbSNhiG7olqsiI', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJHWEJLNHUwZndObU1HWW1MRGw0OGc3WThNUnBoV0ROWld6ZkNQRkhBIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794648765),
('b1mhCAzDbuMSLhFQN8bXMlYOtFiUNEPeTrVthoQS', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJrSlowMUdsUVFYeVNka1VVZ3pSMms1VmRTdXZaRlVPdmxtNW5FZ2ptIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794649769),
('bJCA6i95UZa95yUeQVGCfS0o8IV79uNYWbAhArDY', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJTUzEyd0twZTNYbDN6TlhDWGQ5MTNtQ2hZNkVIUkxMYkI3RFVDY1dFIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794649405),
('blVSB281z1tk6aVnDzxdJYk7O8688sxou3MRsU8R', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJjMVJ6UXRuM2VVazkybFRrNTA2a0IxYW14aERWOHdzSjVDQVlCelA4IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794649467),
('cjDSIO8Pm25V22R1c0H0rB0OvfXUAyFLEWglUfs4', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJBWG1QYjgxbDRoSUJIQmFLYk5jWFF5ck5XRGJhUmNjT0RhbFdaZlNpIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794648764),
('CNFpg9u6CHGLhWK4hDHNXvSVf2iLEdi7vFocfs0T', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJ3dlBLUzg5SXhyeEJxbjcxUnlzWUNCaWpmQ2NLbGNRRnBSS1VvYTFHIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794649638),
('cQWLKn0XN998MIjxkZQjqjc5oxXs13b7lLrGPCzB', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiI0Q3BYVWxiNU4xd3hxcFA3VzhJWktIOGsyUDBpaUpSODhmTG41UGVsIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794649148),
('ctsgjTaDTdgcb3KoI6sodasxNplFADgsAvmUnvJR', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJJSFM4NlVma0RvSGxnNkVCS2IwNElIcUFhcVdMZFRVMUx6djRVbGVxIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794648634),
('CxdRtJWFsFwcfNj4UBptQ5DnOAIlQMBeGh2D5ny2', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJWUlkxV3VwUGxHU1VNSVFSN0dpWmt5YTdwcnZnV3RBTGl1ZG5HTWYwIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794649738),
('CY1sU4KQrOZIPkmnaeMIIwFDZ8D3ZsEsH57O1G05', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJ2SjJadEVPdm5wRnFkUTltWmRieHRoZnhEYm44WXpnc2h4MUs5UWZVIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794649803),
('D05vf88txS38LoIKiXvRTMDtggGclXGREhdenezz', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiIxSDVxMVNhWVZWelQwNnBaYjdMcDExTWNqYno2eDMxNnY3VDlVbW9TIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794648307),
('d8uW9gMOUY69UsTVqNVbI6DNPhKTBeFuwXWzzakd', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiIyTnpuU0kzMUpqejFnSzMyUnlWQ2FjWUVIUGZ1VEViTENCWE81SkZOIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794648405),
('d9ESI3GJDsZtwrq98kTqMJaYEpwXbf089ockq21z', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJpeFFFanNTdXFmZXJ5azRqSUhlcG9sam15Q1BJbkl1dWZLb2JxYVJjIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794648308),
('dGHrUByaHH1KOUOIcGPn8Tvi7qcyOLFpKW6dnsK4', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJNVGR1T1pGRllnMVN5SmZYVEp0Ull2aWpFRzdVYW1CV2pKQ1JjaUlsIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794649606),
('DjVkvRW4PHjPa3yASOoXpRBiMwVStXI6A0mr5mER', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJHZkx6S0c3OThMRlF5SGdwMzEwbW9XUkVRYW9lcWZmeDREdTU4b1FFIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794649834),
('DTXuuypp3hOL2rYnScAcZLMCZFTbfJEg4ghPn0W3', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJXZ0NOazg1TUp1dVQ1UTJ1aElZM2R4WklWaGZNNms4M2ZUelR6cHJyIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794648990),
('e7RpY7RK2uQzYarGCBdxN3fID52XqljrBAOFJPD4', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJrTlRSdTMwbGhqQ1R3VGF1dTFOek5RaG9OQUU5bVZWc2RaNHNmU0VHIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794649936),
('eKRueBbCLdro4C95yAPOJcxtxXM1cScK4I4x3wCA', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJPRTV6UTZnNG9BRklVUmoxaEN3MWhUNWw3U2g5Wk01OFZDMnVOZWpsIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794649835),
('EnGdT7wkyITdrv4fxzOwXjGt0q9oyi6u4a2PFUMv', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJtSkdEdUlrZk9wRlYwZTRTaDVOd1ZQTzVXN2hsd3M1dEtMV3l3QVp2IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794648209),
('EPHk8JK2RDvqf6D3Tu6h93eT4jZpM60hX630Mjmf', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJyMnQ2M0Zqd2F0OGVienQ5R01qbGthOVk2ekZYTGxKSUZyVnlSZnNkIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794649868),
('ESaA07vlvQB23inpPdDx0Mpm1n8iWtIfeFRlWziH', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiI3Z21ldnV4aW9DMVZ3bVgwT0hQM2JhY3FEUE01UGtsQzVlOGhQSm9wIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794649770),
('fEIyHuKviTXiSDuhyXlD9e30vdy0ZrvRZ5E9Mftv', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJqVHI3MTA0dkhDVnNvWEg1Z2ZKTDVnb3dBdzd0WXdaU0EyY0xhUUpsIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794648927),
('fZgy9M5cVWAKU0T5liRX0EjPgmCGYjBXQk1uNCsJ', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJQU3hQN2t3VGxNSVNMOFVTY2ZzMldXbG81TzFSTWdhN3J5T2hySjdQIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794648566),
('g4CCyprSkX1LPlMLywdXAPlXDzmgXPI8pmClWDTc', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiI4RlBIZ0w0QW9PY2JTdmpEdWJNNVVIRXUyYmhkOXdNQjVFOGNqZUtuIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794648828),
('gN2KZW2S34ggceDKdT0RDXsru6IZVHGBmIezZn44', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJQa0k2ODdrWndFcnJxQWZCOGU0MW5PUHRUajVHVGw0OUNXREJvSTFqIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794649085),
('Gv0jUqXYwrfSW6hh8YfK9tyiEPlsvkcI4dAVe696', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJHVVpoV21uWUUwZUpPMENBODZYTVVaY2h2RVI1cGozTjQ0N3FXS2ZMIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794648501),
('gYFMEmhDydkZT6T4KUWrTWZzN52dPkJZ0aZnvtDX', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJGNG1BdjR1ZEUxR2NKOG9ZSGd1OFVBVzFuZHp3WVNHUW13SFBFWHVJIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794648860),
('hKunuvDN2Wv0dF4cygMWwfzQjuqjNd6BHyu8eRYF', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJYRnNEMDFMR3Y5UkdQYlJQTWo1cHhNY3pMamIyNmM3cktKbUlnR3U0IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794648991),
('Ht157gySmxMghLcMj8lKFzRZ2bQxSbBXS5Hi9GaU', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiI3enpvNzFGQTZwcFJzR2dVTExLVUFNRVpJZWdMcGp6dHhPTXVCTktDIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794649212),
('iauhlJqe2rR540UGzhlLMKE9zB6zYR6kKJkZAAVx', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJsRVk5QllhVlBkUUU3RHkwYlBWV3psZkZySkN6ZHZtRzJpZGRDZjV3IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794648470),
('iGmLRxyo1ERE8lCvzL0uFfW4auOKMkVJfq2xGj7F', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJYVFJwcXVFR0k3YVBXb2xtWDNmN0NjV09ibVVnOXFYVmhuT3ZOMGlkIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794648666),
('itfnKvT5tpTGRkO6oUjJI0PZa3xoVvbS7BCTLwTe', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJuZDJhcnR0T1F1RlByUnNVRGUyclNLeDJkU1hNZzdLbEcxbTF0NjVRIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794648243),
('J93Vsu2MqvEm7XYYUe1VrfTijadccC9O9IoTKO1O', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJFbWpmdTNDOGk5bDlwOTZtRjlSWXlIMTRZQlNLYThYemsxUTJobFpNIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794649053),
('JAwhRlxAUYAhYkxZKHq5SjlSGXrzDsTke1iGXdT4', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJoTkNRcEhrMzYyakZxOTloOTBFM1pYNGFkYTJBeXZYRW1mR3VIeVpPIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794649054),
('JGeUalnsNuhznkme0JXuKUv1h0Q30d6QRVy46o4K', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiIwNWZRdzVOSGtnUGhHNmI4UXlMUjhVcVVKUnJHU01FOWNxb3FhU3d1IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794649736),
('JlvJ6w3uVTIjmFMIuyN23R0XeamGRJsII0WWqI6f', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJJZE1pY0xnZ084ZzBpV2VTV2V2ZVNxMGlEVktmUHFXcVZNVXJ6MW54IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794649213),
('Jn346dTP8VASmYYkXMogzeldzRZIQTcgVvJaARoU', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJKOUdGTzdSbUJuSE5LOEdZZ0FwV3ZXclE4aXVUcDRxZFhmcEc5VHI5IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794648827),
('jP6CTZSjDoVnxwTFCvFOnyP5SiMpLb7O8rZvtDgF', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJBNjdLZ2lRaUZzTEtSdXcyTXgzUlV6VjZ5NE1YUXRkUVlHOHhib0IwIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794648468),
('kic5dS80zsXDCxf6h5pA4NbRejvIDFGam4tgobBb', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJCMWpvNkRZdVg5a1NmTVF1SmFhZno5U3lnZjU3bWRJZlBhS1FOcWlmIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794648502),
('KQiqDnrZXxDPqWmyWf4mBoxozsWYNZiZ29g36qEW', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJaYUlRbW1jTXRHbjh6cDdKSHJLcnpicUZQVUJQTXp3d0JEamQySzlVIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794649605),
('KRi5OcEm6B1XRmPefD8lNXq6TZT3mOESsXdyk3YE', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJHbmtCQVRoSVN0VTA1ZVRtZXp1WHNwcVVVUDJuclVUQzNuc2Q4UTBPIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794649901),
('l065x4tnmW6bzZLu7RkSj3LAsOPMCbSLHILM9WGH', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJoSmtOcWpJeE9tVzM2M0p3TUY4UE1wd3hxUjhsM1l0bFhhNG9nM0JTIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794648534),
('ldOCNe29L5EcMV5oBSAxAW36Qjuwc10ptfXD4P8e', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJ5M2d3cERLcUE3aUFiZ0t6YXc1bEg1T2g4eGtqMW0wRm9jY3VKOUZsIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794648795),
('lH6aqQRsJzkxoia0fkLZeh8iA07Qgn1wc7A4qmfd', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJQeHJDeVA0RlJ6UXpQbVVtQTdDOFVrZE5UdFZTTnQ5QkRybzY1QlpKIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794649277),
('LWWesEvzL6n3Xm7033anYgWe3GXNRtqGX3v29KsS', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJIMzVhM094VDBXd0JlVnRiNU1RRlRmSkNFUFJ0UjBnWktEallOajRoIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794648373),
('mCAVKOnaj4LaGOKfQqXT6Fq2mLNWOv9rk9BE0hIz', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJJd2VCZlJPalZrd2d2YnBFMXpIOUUwTkZQU1psUkVCTmYySjNDMjZQIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794649403),
('mIpM58tyZeFDv5dY9WbughdFtzsHEZehoPDmvdfe', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiI4VVJMU3d4Zjg4dG92MmZPd1BvaHk5R3NKWmp2dFZTV29wR0FFWGRMIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794648406),
('MKIVOQwoSSYtSdOS4p4YpvRFxPYJfIVcGvKbnUhW', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJ3RzkxcjRjdUNtbTUwdjhyeXJuR3Q4QWVNYm5IekFHVEkydVJLbHh1IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794649371),
('MlYjnug4unZsK56VTxYlDnKTdqBiAEMeWZPaNcOt', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJwaDdVc3djcUN5YVNjY292cUdoZFlDSU1NbHBZV1VoeGpMNVpKeklNIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794648733),
('mvmmSeGvtqiSMQXoBnKXuWANDevpK57jkmchI8Ic', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJ0NnM5UWRlSmgwZFRhZ2NsaWtOdGdrd2VoMjc5d0t5N3NqUEdFYzhZIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794648635),
('N5Eod3eWjVNCFoCFDAwvaoj0XVkgG71agG2ANIfE', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiI3RkFmREJ5ZkVpN3pPbUVyQjl1dEVvYlNISDJYR0ZhOWpuU3BmVzlMIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794649180),
('nbP2W0l4Xqpfn3uxalKub0YcfovLbQrp8Cy75CJm', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJTWnV1SGRudVJuSlVuOW1iUmNEN0tLOWJ2aW1HZE1LMzBjcEZPRThrIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794648859),
('ngUUU3HFNL4baDV6WkIsgHppTO6Yopx6kftNC9tD', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiIweTY5M0hMQ0tWV0k5THlQTUJDMGx2RmVrZkxXSEVqZVhoM0xjSXB0IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794649670),
('OC0A3YZauUXNZyNW3qgxkkKteB7eCiO8p24p3bOV', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJJTWR6eGVwQ1c4MHpZWEpsdk5Mckp3eG5uVkJpTXI1OXh6c2hpNHFTIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794648276),
('odukA6SkNHNBH1xiDITjn7hylWXl9XVdTMnPyH7z', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJXOFBBM2FIeFRrQ3dMcmJjZjlxQU9sRnJidWlvYnR3YjY1V1VhbTFlIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794649500),
('OZf3UJmBFDdUmV8AQA4N4LFYTPa38kylL3EuDwd8', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJBS2FJNnE0SnhrbHhyS1prd2tSWHJVU0EyQnBnekViTkVLb3lBb3RpIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794649307),
('p11xywWbOrUPRTNRKcSmLq72cZ0pL7QTLbYRCjQm', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJ2SVFMNjZYaFZmNnNHY0ZNQmRlYXJIM1VvZzAwQTNFcG9RSG9iTGtxIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794648893),
('P1dEGRm8a1nr7xL2L89zxgbRGJ0YGQVspxmLwDu4', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJnbUdjWkdpUHZCV2lkcHNVamR5a0lxOHNYR29DV2YyY0h0ZWVEMXlyIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794649903),
('P9IaG9dX1tEIojU05QLfePpqoDjJuuzdxcNPjN1S', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJ2NDJiZW8yS3ozY1dpNjlacmNyNThuNVJleUtNWmU4SEZLcFJPT2w0IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794648668),
('pPClwASasC7rRuNnvoYMEq27IjAvzoThQZo9RV7O', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJna3pUWlVxQ0dCdzFWTUpXUk80Z01DSW9LNEkwYWkwYVZTUkxPN0xxIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794648208),
('PTeNQf25OLnELJtlazv1GiZxt0sGXP6Cli4e7eD5', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJjZDdYQzB2V0Npc0JRTFVIbmVrMDVEeXFBSmR2VlR1RnY1MEE1R01QIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794649244),
('PYbZrkikPAnN2cCVyJzMxv1PDVwZQiRKLdsoQj0U', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJ0RnFlOG5IQklyb1NIdzcyZ0haUVh2YlcxcVBjYnFIVjVEOG5pT1JUIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794648731),
('QdSoJBtQzymzMK3gcwaS6QBCn0sbIVVqeJdQA8EN', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJXUElPWG5nQlkyQ2xKS25qSGxHcHRSRzFzdXB0QmxRcW9UNHpQNWhQIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794649639),
('qJsKkOPRpa0s3HnoIEQYpdto22KMMW3umgGvK32Y', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJYRWo0cGhDUmxjUDFWdUVXTmJOUEhUR2VUUXlrOVZObzFCMjR5QlhGIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794649276),
('QVUa1WKId1Pi5xC2Jk1CAEoZHk9O7Pm8SNzLRiXc', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJjM24ydHQzZEhUZ0NWOTRnQlhVdEtleFA3M05UOWpIS3RxcUZKdVlIIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794649181),
('QyXWaTmg1zqvmCLQmsPLGPPtHMjg0U2Ts5h8oXte', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiIzUEg3cmNuYTFzUTlZVURtRWdHdGVud1FTZ0hNSjg5cEszMHpocjJqIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794649499),
('qzHOgxrmC0LXr6NQynKhse21658yM6O0OCrXqdxX', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJRcmlEdjB1UzhFcUozdHR5dTdKNEliMEg3RjBnY1RhSVBhdGh0dGN4IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794648274),
('r3KjeykQgDef4hb3LSSVEAoHvsBfJcUwXehqbYBb', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJMNWN2dkt5Njh2V1YxNlZxVGRjcXVQQldLeWlVMDFoWEY3R1NuSk5xIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794648438),
('r9sPTElZIohZ7JvIgAhcpDX5dEBsM2mPbpDj877S', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJmZm5jdEtPeGExVmJNQkRES3B3MUI0YXlvZmw1emphUzAzU2hSa3c0IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794649309),
('rxRx3MWhPMHD4JrvEXDEK281sd0UwnI259NMluZk', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJndGNoMWlwQjVzcEJjeTl0WnNGNUQ1ZFJXMnlFelM2THh4MTZONzJhIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794648603),
('sBseZm03LVLd7hbH3NnbJ8XwPlC1OwePTkiQhogX', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJHMXBVdmFrQ0ZYNHJoRm5FdEtuaGt6aGpmYUZ3QW5oMU9mZjNFYTJlIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9hZG1pbiIsInJvdXRlIjpudWxsfSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1794654289),
('SBTbV0MQ4qRI9Z4SBHOXgSkZMHPm6HxbTPf1rnOo', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJUSERkdE12RG5HamxSOERXVU1ldDQ3aEI0eFZGalhHc2Z1VkJWVEJZIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794649436),
('t33s83oT1NvEg9K5p0CAp1TH9K5PvBBqKmySFji8', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJscE8xeno1SGpXMHRHRmZMSUptS0JVbm91a1JPeTZhYXhZRjd1blFKIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794648926),
('tBuQJcaagOXeapfKMZW8enUsMHlkY1ucmzIUF2CN', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiIwOWREUk5tMVVpbW91WHJKTUNNQng2eDNiYzBoN2kyY1pmeGJzN054IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794649339),
('TKwNsgHWF8OUaBMUXLuom6oyBjmiz7zV072jbtQY', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJVSzBhNVB2bW00QlpLZmhpbFQwbzZjRmRXYmZVMjNhamlzY1Fyd2Z0IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794649021),
('TQaBMfODl6VhVttIe7U2Sl4M8tCHrQqieVdTSAJa', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJUanF5aHg5TDNOYTdsYjlFbHY2M2xCcTdicFlHRjk3emMwaTd3WDJNIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794649574),
('TrdxEpkXHYSTUH030aDxnUfZGUywvjgCqMUarPyI', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJBVVZ6NjhYcWhhalI0ZFN0TURHSHpxTkxSUnNUM1kyQ3ZKR0RSQkN2IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794649435),
('U9EBQkU2oIXZEZCDPUeKtkxE3bgmDa1mnvIjOPa2', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJCNzBZTVJwMm1UOWlFckdMZ05uVUdka1JOS1V6SHRyazRpd1ZLY0dFIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794649372),
('uJ0wyNlVn0mLjEBJunDTzu1td7OzJfCaoJmXmzZm', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJKNXN6VGh1N2JmVUlNNUczM0pwQUlpalk1OHpSNm9QVW1MSUpxcHBIIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794648564),
('uSZ552RRDEosEYoiiKZLwAbioy4x4aw6fvLNi9Ke', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJrOWd1a2RWM21DT2s0bG4wSDBiVnRSQVVPTFVNWXRhSTIwdnhvSXF6IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794649934),
('uVOLL4yObqbaIPeqRf7h7jze9UTwHQNJFOHxMW0R', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJ3c1NjQndEdmZoUzZXUUxSUU9CR1lyblVyaklwbU5ueTlqR1VPcnh6IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794649972),
('Uz9Y33SCGkZvN6IqJx8s4GdF4KeQg5Be9dQlFERk', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJGMWV3YjhhcGxGeTZtWUJ0ZDZRMFZzTk55RWtkdkczbkp6bHVoR2dVIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794649468),
('Vjn5c4BCKqFFXh0mtFQsRP4S4ah6ehzi2MipT8Xc', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJIN0JJNWw2TE0zcDJCMmJFQ210Mm5sTHp1VmhoM0pTTTV1dVBWQ1hTIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794649703),
('VtWqkOmz3EW3QwTBemEEpNPDj4Bj8fyQO99xS1UQ', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJpUDhzOEU2M1hWcXhlMnRZbHAyU29RVHhjallZYlM3Um5NNER1clFtIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794649149),
('WNNopip3PtqPhDYbg0OEwNKFGv19p29frsbKRwEC', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiI1VnFINDdwemJzWkZ5Z29mNGhnd1NJVkxTZ1pTOHNFS3d6b3BGRkN2IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794649245),
('XN4775MZtPIMNNP8tMRFoZalU7XrTAyGCvkWTFWh', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJscDRITk9hb29GTmZJSVRxdGNvbXBOU0ZOTXFRUXlDN2VHNXh2RFBQIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794649340),
('XybU12nMLKXUSlLsDLxGPrF4zQeOHc66WEplh4K3', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJLSmZ2aENjeEtNOVZXaEZTRzF5WGdOQllSNjloY0ozWTBJcGVXMDFlIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794649086),
('yhMeUZvg6ZD4UlH7VzEJm19zA7spLugrdiMbnWHf', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJjelJJMm1KblB2T2U4ZEFockVTaTliQ2R2VkY3WmJIRzkzb0FwbWc1IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794648340),
('yo1XBgByaKcVMIUCfHIyrCGfDgDMFiUzGapWlIG6', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJ6T2hRUjRSNlhQdUlnNEducThLam9OZFduc1h5U1FJRm1DZkxLVVZmIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794649536),
('yPW6ekGGz90Fq9SiZ5bcaknSPKWJVc2wcTd16dpp', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJ4UHptU1lHZWtFeHdUcXlDWVlmZEFxVTdpTjJJNjE1b1dkRHBkQUx1IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794649672),
('zkgT5z7fG0bkNhAjhzxgvRmCTWuXUbxOTvMiXaOS', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJwN0pJM1piRW8xMTRzaFVYT0JydmFtdFR1TG4zTTZmOUFUWVpsNzd6IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9oZWFsdGgiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1794649968),
('zoC7izBYaf01ixhnAkU0B1rggPAGGGt51cEVFnml', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJ5Mk5wZ3dOOEg1R1ptWk5RN3Rldjdkem5aeGxFMkV0dGFJUGJUbnE4IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794649022),
('ZUxKcRjlAMh8VVxSDTOfk12PIml4dhB6wzVKkY1V', NULL, '127.0.0.1', 'opencode/latest/2.3.0/cli', 'eyJfdG9rZW4iOiJJWDU2TVVLZTlpdGhaUUNCaURhU0tPT09PSkprMGZKUmh5cnI4QVdDIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC92MVwvbW9kZWxzIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1794648959);

-- --------------------------------------------------------

--
-- Table structure for table `shipping_settings`
--

CREATE TABLE `shipping_settings` (
  `id` bigint UNSIGNED NOT NULL,
  `origin_destination_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `store_latitude` decimal(10,8) NOT NULL,
  `store_longitude` decimal(11,8) NOT NULL,
  `free_shipping_max_distance` decimal(8,2) NOT NULL DEFAULT '0.00',
  `default_flat_rate` decimal(15,2) NOT NULL DEFAULT '0.00',
  `rate_per_km` decimal(15,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `shipping_settings`
--

INSERT INTO `shipping_settings` (`id`, `origin_destination_id`, `store_latitude`, `store_longitude`, `free_shipping_max_distance`, `default_flat_rate`, `rate_per_km`, `created_at`, `updated_at`) VALUES
(1, NULL, -6.90342770, 107.61806640, 5.00, 12000.00, 0.00, '2026-11-14 02:23:41', '2026-11-14 02:23:41');

-- --------------------------------------------------------

--
-- Table structure for table `stock_movements`
--

CREATE TABLE `stock_movements` (
  `id` bigint UNSIGNED NOT NULL,
  `product_id` bigint UNSIGNED NOT NULL,
  `variant_id` bigint UNSIGNED NOT NULL,
  `order_id` bigint UNSIGNED DEFAULT NULL,
  `order_item_id` bigint UNSIGNED DEFAULT NULL,
  `movement_key` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity_delta` int NOT NULL,
  `balance_after` int UNSIGNED NOT NULL,
  `stock_dimension` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'available',
  `reference_type` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reference_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `occurred_at` timestamp NOT NULL,
  `created_by` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_by` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `stock_movements`
--

INSERT INTO `stock_movements` (`id`, `product_id`, `variant_id`, `order_id`, `order_item_id`, `movement_key`, `type`, `quantity_delta`, `balance_after`, `stock_dimension`, `reference_type`, `reference_id`, `notes`, `occurred_at`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 1, NULL, NULL, 'INIT-1', 'initial', 12, 12, 'available', NULL, NULL, 'Stok awal koleksi Kaos Polos Cotton Combed 24s Hitam', '2026-11-14 00:23:55', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-14 00:23:55', '2026-11-14 00:23:55', NULL),
(2, 1, 2, NULL, NULL, 'INIT-2', 'initial', 23, 23, 'available', NULL, NULL, 'Stok awal koleksi Kaos Polos Cotton Combed 24s Hitam', '2026-11-14 00:23:55', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-14 00:23:55', '2026-11-14 00:23:55', NULL),
(3, 1, 3, NULL, NULL, 'INIT-3', 'initial', 34, 34, 'available', NULL, NULL, 'Stok awal koleksi Kaos Polos Cotton Combed 24s Hitam', '2026-11-14 00:23:55', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-14 00:23:55', '2026-11-14 00:23:55', NULL),
(4, 1, 4, NULL, NULL, 'INIT-4', 'initial', 45, 45, 'available', NULL, NULL, 'Stok awal koleksi Kaos Polos Cotton Combed 24s Hitam', '2026-11-14 00:23:55', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-14 00:23:55', '2026-11-14 00:23:55', NULL),
(5, 1, 5, NULL, NULL, 'INIT-5', 'initial', 14, 14, 'available', NULL, NULL, 'Stok awal koleksi Kaos Polos Cotton Combed 24s Hitam', '2026-11-14 00:23:55', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-14 00:23:55', '2026-11-14 00:23:55', NULL),
(6, 2, 6, NULL, NULL, 'INIT-6', 'initial', 7, 7, 'available', NULL, NULL, 'Stok awal koleksi Kaos Oversize Drop Shoulder Cream', '2026-11-13 19:23:55', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 19:23:55', '2026-11-13 19:23:55', NULL),
(7, 2, 7, NULL, NULL, 'INIT-7', 'initial', 18, 18, 'available', NULL, NULL, 'Stok awal koleksi Kaos Oversize Drop Shoulder Cream', '2026-11-13 19:23:55', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 19:23:55', '2026-11-13 19:23:55', NULL),
(8, 2, 8, NULL, NULL, 'INIT-8', 'initial', 29, 29, 'available', NULL, NULL, 'Stok awal koleksi Kaos Oversize Drop Shoulder Cream', '2026-11-13 19:23:55', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 19:23:55', '2026-11-13 19:23:55', NULL),
(9, 2, 9, NULL, NULL, 'INIT-9', 'initial', 40, 40, 'available', NULL, NULL, 'Stok awal koleksi Kaos Oversize Drop Shoulder Cream', '2026-11-13 19:23:55', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 19:23:55', '2026-11-13 19:23:55', NULL),
(10, 3, 10, NULL, NULL, 'INIT-10', 'initial', 44, 44, 'available', NULL, NULL, 'Stok awal koleksi Kaos Lengan Panjang Heavyweight Doff Abu', '2026-11-13 14:23:55', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 14:23:55', '2026-11-13 14:23:55', NULL),
(11, 3, 11, NULL, NULL, 'INIT-11', 'initial', 13, 13, 'available', NULL, NULL, 'Stok awal koleksi Kaos Lengan Panjang Heavyweight Doff Abu', '2026-11-13 14:23:55', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 14:23:55', '2026-11-13 14:23:55', NULL),
(12, 3, 12, NULL, NULL, 'INIT-12', 'initial', 24, 24, 'available', NULL, NULL, 'Stok awal koleksi Kaos Lengan Panjang Heavyweight Doff Abu', '2026-11-13 14:23:55', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 14:23:55', '2026-11-13 14:23:55', NULL),
(13, 3, 13, NULL, NULL, 'INIT-13', 'initial', 35, 35, 'available', NULL, NULL, 'Stok awal koleksi Kaos Lengan Panjang Heavyweight Doff Abu', '2026-11-13 14:23:55', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 14:23:55', '2026-11-13 14:23:55', NULL),
(14, 4, 14, NULL, NULL, 'INIT-14', 'initial', 39, 39, 'available', NULL, NULL, 'Stok awal koleksi Kaos Raglan Cotton Blend Navy', '2026-11-13 09:23:55', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 09:23:55', '2026-11-13 09:23:55', NULL),
(15, 4, 15, NULL, NULL, 'INIT-15', 'initial', 8, 8, 'available', NULL, NULL, 'Stok awal koleksi Kaos Raglan Cotton Blend Navy', '2026-11-13 09:23:55', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 09:23:55', '2026-11-13 09:23:55', NULL),
(16, 4, 16, NULL, NULL, 'INIT-16', 'initial', 19, 19, 'available', NULL, NULL, 'Stok awal koleksi Kaos Raglan Cotton Blend Navy', '2026-11-13 09:23:55', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 09:23:55', '2026-11-13 09:23:55', NULL),
(17, 4, 17, NULL, NULL, 'INIT-17', 'initial', 30, 30, 'available', NULL, NULL, 'Stok awal koleksi Kaos Raglan Cotton Blend Navy', '2026-11-13 09:23:55', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 09:23:55', '2026-11-13 09:23:55', NULL),
(18, 5, 18, NULL, NULL, 'INIT-18', 'initial', 34, 34, 'available', NULL, NULL, 'Stok awal koleksi Kaos Premium Combed 30s Putih', '2026-11-13 04:23:55', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 04:23:55', '2026-11-13 04:23:55', NULL),
(19, 5, 19, NULL, NULL, 'INIT-19', 'initial', 45, 45, 'available', NULL, NULL, 'Stok awal koleksi Kaos Premium Combed 30s Putih', '2026-11-13 04:23:55', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 04:23:55', '2026-11-13 04:23:55', NULL),
(20, 5, 20, NULL, NULL, 'INIT-20', 'initial', 14, 14, 'available', NULL, NULL, 'Stok awal koleksi Kaos Premium Combed 30s Putih', '2026-11-13 04:23:55', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 04:23:55', '2026-11-13 04:23:55', NULL),
(21, 5, 21, NULL, NULL, 'INIT-21', 'initial', 25, 25, 'available', NULL, NULL, 'Stok awal koleksi Kaos Premium Combed 30s Putih', '2026-11-13 04:23:55', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 04:23:55', '2026-11-13 04:23:55', NULL),
(22, 6, 22, NULL, NULL, 'INIT-22', 'initial', 29, 29, 'available', NULL, NULL, 'Stok awal koleksi Kaos Oversize Graphic Slow Living Sand', '2026-11-12 23:23:55', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-12 23:23:55', '2026-11-12 23:23:55', NULL),
(23, 6, 23, NULL, NULL, 'INIT-23', 'initial', 40, 40, 'available', NULL, NULL, 'Stok awal koleksi Kaos Oversize Graphic Slow Living Sand', '2026-11-12 23:23:55', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-12 23:23:55', '2026-11-12 23:23:55', NULL),
(24, 6, 24, NULL, NULL, 'INIT-24', 'initial', 9, 9, 'available', NULL, NULL, 'Stok awal koleksi Kaos Oversize Graphic Slow Living Sand', '2026-11-12 23:23:55', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-12 23:23:55', '2026-11-12 23:23:55', NULL),
(25, 7, 25, NULL, NULL, 'INIT-25', 'initial', 24, 24, 'available', NULL, NULL, 'Stok awal koleksi Kaos Turtle Neck Rib Hitam', '2026-11-12 18:23:55', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-12 18:23:55', '2026-11-12 18:23:55', NULL),
(26, 7, 26, NULL, NULL, 'INIT-26', 'initial', 35, 35, 'available', NULL, NULL, 'Stok awal koleksi Kaos Turtle Neck Rib Hitam', '2026-11-12 18:23:55', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-12 18:23:55', '2026-11-12 18:23:55', NULL),
(27, 7, 27, NULL, NULL, 'INIT-27', 'initial', 46, 46, 'available', NULL, NULL, 'Stok awal koleksi Kaos Turtle Neck Rib Hitam', '2026-11-12 18:23:55', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-12 18:23:55', '2026-11-12 18:23:55', NULL),
(28, 8, 28, NULL, NULL, 'INIT-28', 'initial', 19, 19, 'available', NULL, NULL, 'Stok awal koleksi Kaos Crop Boxy Sage', '2026-11-12 13:23:55', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-12 13:23:55', '2026-11-12 13:23:55', NULL),
(29, 8, 29, NULL, NULL, 'INIT-29', 'initial', 30, 30, 'available', NULL, NULL, 'Stok awal koleksi Kaos Crop Boxy Sage', '2026-11-12 13:23:55', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-12 13:23:55', '2026-11-12 13:23:55', NULL),
(30, 8, 30, NULL, NULL, 'INIT-30', 'initial', 41, 41, 'available', NULL, NULL, 'Stok awal koleksi Kaos Crop Boxy Sage', '2026-11-12 13:23:55', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-12 13:23:55', '2026-11-12 13:23:55', NULL),
(31, 9, 31, NULL, NULL, 'INIT-31', 'initial', 14, 14, 'available', NULL, NULL, 'Stok awal koleksi Kaos Polo Knit Sand', '2026-11-12 09:44:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-12 09:44:00', '2026-11-12 09:44:00', NULL),
(32, 9, 32, NULL, NULL, 'INIT-32', 'initial', 25, 25, 'available', NULL, NULL, 'Stok awal koleksi Kaos Polo Knit Sand', '2026-11-12 09:44:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-12 09:44:00', '2026-11-12 09:44:00', NULL),
(33, 9, 33, NULL, NULL, 'INIT-33', 'initial', 36, 36, 'available', NULL, NULL, 'Stok awal koleksi Kaos Polo Knit Sand', '2026-11-12 09:44:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-12 09:44:00', '2026-11-12 09:44:00', NULL),
(34, 9, 34, NULL, NULL, 'INIT-34', 'initial', 47, 47, 'available', NULL, NULL, 'Stok awal koleksi Kaos Polo Knit Sand', '2026-11-12 09:44:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-12 09:44:00', '2026-11-12 09:44:00', NULL),
(35, 10, 35, NULL, NULL, 'INIT-35', 'initial', 9, 9, 'available', NULL, NULL, 'Stok awal koleksi Kaos Undershirt Viscose Putih', '2026-11-10 10:57:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-10 10:57:00', '2026-11-10 10:57:00', NULL),
(36, 10, 36, NULL, NULL, 'INIT-36', 'initial', 20, 20, 'available', NULL, NULL, 'Stok awal koleksi Kaos Undershirt Viscose Putih', '2026-11-10 10:57:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-10 10:57:00', '2026-11-10 10:57:00', NULL),
(37, 10, 37, NULL, NULL, 'INIT-37', 'initial', 31, 31, 'available', NULL, NULL, 'Stok awal koleksi Kaos Undershirt Viscose Putih', '2026-11-10 10:57:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-10 10:57:00', '2026-11-10 10:57:00', NULL),
(38, 11, 38, NULL, NULL, 'INIT-38', 'initial', 46, 46, 'available', NULL, NULL, 'Stok awal koleksi Kemeja Flannel Kotak Maroon', '2026-11-08 01:10:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-08 01:10:00', '2026-11-08 01:10:00', NULL),
(39, 11, 39, NULL, NULL, 'INIT-39', 'initial', 15, 15, 'available', NULL, NULL, 'Stok awal koleksi Kemeja Flannel Kotak Maroon', '2026-11-08 01:10:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-08 01:10:00', '2026-11-08 01:10:00', NULL),
(40, 11, 40, NULL, NULL, 'INIT-40', 'initial', 26, 26, 'available', NULL, NULL, 'Stok awal koleksi Kemeja Flannel Kotak Maroon', '2026-11-08 01:10:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-08 01:10:00', '2026-11-08 01:10:00', NULL),
(41, 11, 41, NULL, NULL, 'INIT-41', 'initial', 37, 37, 'available', NULL, NULL, 'Stok awal koleksi Kemeja Flannel Kotak Maroon', '2026-11-08 01:10:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-08 01:10:00', '2026-11-08 01:10:00', NULL),
(42, 12, 42, NULL, NULL, 'INIT-42', 'initial', 41, 41, 'available', NULL, NULL, 'Stok awal koleksi Kemeja Oxford Slim Fit Putih', '2026-11-06 02:23:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-06 02:23:00', '2026-11-06 02:23:00', NULL),
(43, 12, 43, NULL, NULL, 'INIT-43', 'initial', 10, 10, 'available', NULL, NULL, 'Stok awal koleksi Kemeja Oxford Slim Fit Putih', '2026-11-06 02:23:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-06 02:23:00', '2026-11-06 02:23:00', NULL),
(44, 12, 44, NULL, NULL, 'INIT-44', 'initial', 21, 21, 'available', NULL, NULL, 'Stok awal koleksi Kemeja Oxford Slim Fit Putih', '2026-11-06 02:23:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-06 02:23:00', '2026-11-06 02:23:00', NULL),
(45, 12, 45, NULL, NULL, 'INIT-45', 'initial', 32, 32, 'available', NULL, NULL, 'Stok awal koleksi Kemeja Oxford Slim Fit Putih', '2026-11-06 02:23:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-06 02:23:00', '2026-11-06 02:23:00', NULL),
(46, 13, 46, NULL, NULL, 'INIT-46', 'initial', 36, 36, 'available', NULL, NULL, 'Stok awal koleksi Kemeja Linen Oversize Khaki', '2026-11-04 03:36:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-04 03:36:00', '2026-11-04 03:36:00', NULL),
(47, 13, 47, NULL, NULL, 'INIT-47', 'initial', 47, 47, 'available', NULL, NULL, 'Stok awal koleksi Kemeja Linen Oversize Khaki', '2026-11-04 03:36:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-04 03:36:00', '2026-11-04 03:36:00', NULL),
(48, 13, 48, NULL, NULL, 'INIT-48', 'initial', 16, 16, 'available', NULL, NULL, 'Stok awal koleksi Kemeja Linen Oversize Khaki', '2026-11-04 03:36:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-04 03:36:00', '2026-11-04 03:36:00', NULL),
(49, 14, 49, NULL, NULL, 'INIT-49', 'initial', 31, 31, 'available', NULL, NULL, 'Stok awal koleksi Kemeja Denim Washed Biru', '2026-11-02 04:49:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-02 04:49:00', '2026-11-02 04:49:00', NULL),
(50, 14, 50, NULL, NULL, 'INIT-50', 'initial', 42, 42, 'available', NULL, NULL, 'Stok awal koleksi Kemeja Denim Washed Biru', '2026-11-02 04:49:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-02 04:49:00', '2026-11-02 04:49:00', NULL),
(51, 14, 51, NULL, NULL, 'INIT-51', 'initial', 11, 11, 'available', NULL, NULL, 'Stok awal koleksi Kemeja Denim Washed Biru', '2026-11-02 04:49:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-02 04:49:00', '2026-11-02 04:49:00', NULL),
(52, 14, 52, NULL, NULL, 'INIT-52', 'initial', 22, 22, 'available', NULL, NULL, 'Stok awal koleksi Kemeja Denim Washed Biru', '2026-11-02 04:49:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-02 04:49:00', '2026-11-02 04:49:00', NULL),
(53, 15, 53, NULL, NULL, 'INIT-53', 'initial', 26, 26, 'available', NULL, NULL, 'Stok awal koleksi Kemeja Batik Lengan Panjang Parang', '2026-10-31 05:02:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-31 05:02:00', '2026-10-31 05:02:00', NULL),
(54, 15, 54, NULL, NULL, 'INIT-54', 'initial', 37, 37, 'available', NULL, NULL, 'Stok awal koleksi Kemeja Batik Lengan Panjang Parang', '2026-10-31 05:02:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-31 05:02:00', '2026-10-31 05:02:00', NULL),
(55, 15, 55, NULL, NULL, 'INIT-55', 'initial', 6, 6, 'available', NULL, NULL, 'Stok awal koleksi Kemeja Batik Lengan Panjang Parang', '2026-10-31 05:02:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-31 05:02:00', '2026-10-31 05:02:00', NULL),
(56, 15, 56, NULL, NULL, 'INIT-56', 'initial', 17, 17, 'available', NULL, NULL, 'Stok awal koleksi Kemeja Batik Lengan Panjang Parang', '2026-10-31 05:02:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-31 05:02:00', '2026-10-31 05:02:00', NULL),
(57, 16, 57, NULL, NULL, 'INIT-57', 'initial', 21, 21, 'available', NULL, NULL, 'Stok awal koleksi Kemeja Corduroy Cokelat Tua', '2026-10-29 06:15:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-29 06:15:00', '2026-10-29 06:15:00', NULL),
(58, 16, 58, NULL, NULL, 'INIT-58', 'initial', 32, 32, 'available', NULL, NULL, 'Stok awal koleksi Kemeja Corduroy Cokelat Tua', '2026-10-29 06:15:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-29 06:15:00', '2026-10-29 06:15:00', NULL),
(59, 16, 59, NULL, NULL, 'INIT-59', 'initial', 43, 43, 'available', NULL, NULL, 'Stok awal koleksi Kemeja Corduroy Cokelat Tua', '2026-10-29 06:15:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-29 06:15:00', '2026-10-29 06:15:00', NULL),
(60, 17, 60, NULL, NULL, 'INIT-60', 'initial', 16, 16, 'available', NULL, NULL, 'Stok awal koleksi Kemeja Twill Asimetri Navy', '2026-10-27 07:28:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-27 07:28:00', '2026-10-27 07:28:00', NULL),
(61, 17, 61, NULL, NULL, 'INIT-61', 'initial', 27, 27, 'available', NULL, NULL, 'Stok awal koleksi Kemeja Twill Asimetri Navy', '2026-10-27 07:28:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-27 07:28:00', '2026-10-27 07:28:00', NULL),
(62, 17, 62, NULL, NULL, 'INIT-62', 'initial', 38, 38, 'available', NULL, NULL, 'Stok awal koleksi Kemeja Twill Asimetri Navy', '2026-10-27 07:28:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-27 07:28:00', '2026-10-27 07:28:00', NULL),
(63, 18, 63, NULL, NULL, 'INIT-63', 'initial', 11, 11, 'available', NULL, NULL, 'Stok awal koleksi Kemeja Camp Shirt Bunga Hutan', '2026-10-25 08:41:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-25 08:41:00', '2026-10-25 08:41:00', NULL),
(64, 18, 64, NULL, NULL, 'INIT-64', 'initial', 22, 22, 'available', NULL, NULL, 'Stok awal koleksi Kemeja Camp Shirt Bunga Hutan', '2026-10-25 08:41:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-25 08:41:00', '2026-10-25 08:41:00', NULL),
(65, 18, 65, NULL, NULL, 'INIT-65', 'initial', 33, 33, 'available', NULL, NULL, 'Stok awal koleksi Kemeja Camp Shirt Bunga Hutan', '2026-10-25 08:41:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-25 08:41:00', '2026-10-25 08:41:00', NULL),
(66, 19, 66, NULL, NULL, 'INIT-66', 'initial', 6, 6, 'available', NULL, NULL, 'Stok awal koleksi Jaket Denim Oversize Blue Washed', '2026-10-23 09:54:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-23 09:54:00', '2026-10-23 09:54:00', NULL),
(67, 19, 67, NULL, NULL, 'INIT-67', 'initial', 17, 17, 'available', NULL, NULL, 'Stok awal koleksi Jaket Denim Oversize Blue Washed', '2026-10-23 09:54:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-23 09:54:00', '2026-10-23 09:54:00', NULL),
(68, 19, 68, NULL, NULL, 'INIT-68', 'initial', 28, 28, 'available', NULL, NULL, 'Stok awal koleksi Jaket Denim Oversize Blue Washed', '2026-10-23 09:54:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-23 09:54:00', '2026-10-23 09:54:00', NULL),
(69, 19, 69, NULL, NULL, 'INIT-69', 'initial', 39, 39, 'available', NULL, NULL, 'Stok awal koleksi Jaket Denim Oversize Blue Washed', '2026-10-23 09:54:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-23 09:54:00', '2026-10-23 09:54:00', NULL),
(70, 20, 70, NULL, NULL, 'INIT-70', 'initial', 43, 43, 'available', NULL, NULL, 'Stok awal koleksi Jaket Varsity Wool Blend Navy Cream', '2026-10-21 10:07:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-21 10:07:00', '2026-10-21 10:07:00', NULL),
(71, 20, 71, NULL, NULL, 'INIT-71', 'initial', 12, 12, 'available', NULL, NULL, 'Stok awal koleksi Jaket Varsity Wool Blend Navy Cream', '2026-10-21 10:07:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-21 10:07:00', '2026-10-21 10:07:00', NULL),
(72, 20, 72, NULL, NULL, 'INIT-72', 'initial', 23, 23, 'available', NULL, NULL, 'Stok awal koleksi Jaket Varsity Wool Blend Navy Cream', '2026-10-21 10:07:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-21 10:07:00', '2026-10-21 10:07:00', NULL),
(73, 21, 73, NULL, NULL, 'INIT-73', 'initial', 38, 38, 'available', NULL, NULL, 'Stok awal koleksi Jaket Bomber Ripstop Hitam', '2026-10-19 01:20:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-19 01:20:00', '2026-10-19 01:20:00', NULL),
(74, 21, 74, NULL, NULL, 'INIT-74', 'initial', 7, 7, 'available', NULL, NULL, 'Stok awal koleksi Jaket Bomber Ripstop Hitam', '2026-10-19 01:20:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-19 01:20:00', '2026-10-19 01:20:00', NULL),
(75, 21, 75, NULL, NULL, 'INIT-75', 'initial', 18, 18, 'available', NULL, NULL, 'Stok awal koleksi Jaket Bomber Ripstop Hitam', '2026-10-19 01:20:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-19 01:20:00', '2026-10-19 01:20:00', NULL),
(76, 21, 76, NULL, NULL, 'INIT-76', 'initial', 29, 29, 'available', NULL, NULL, 'Stok awal koleksi Jaket Bomber Ripstop Hitam', '2026-10-19 01:20:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-19 01:20:00', '2026-10-19 01:20:00', NULL),
(77, 22, 77, NULL, NULL, 'INIT-77', 'initial', 33, 33, 'available', NULL, NULL, 'Stok awal koleksi Jaket Hiking Softshell Abu', '2026-10-17 02:33:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-17 02:33:00', '2026-10-17 02:33:00', NULL),
(78, 22, 78, NULL, NULL, 'INIT-78', 'initial', 44, 44, 'available', NULL, NULL, 'Stok awal koleksi Jaket Hiking Softshell Abu', '2026-10-17 02:33:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-17 02:33:00', '2026-10-17 02:33:00', NULL),
(79, 22, 79, NULL, NULL, 'INIT-79', 'initial', 13, 13, 'available', NULL, NULL, 'Stok awal koleksi Jaket Hiking Softshell Abu', '2026-10-17 02:33:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-17 02:33:00', '2026-10-17 02:33:00', NULL),
(80, 23, 80, NULL, NULL, 'INIT-80', 'initial', 28, 28, 'available', NULL, NULL, 'Stok awal koleksi Jaket Kanvas Kerja Cokelat', '2026-10-15 03:46:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-15 03:46:00', '2026-10-15 03:46:00', NULL),
(81, 23, 81, NULL, NULL, 'INIT-81', 'initial', 39, 39, 'available', NULL, NULL, 'Stok awal koleksi Jaket Kanvas Kerja Cokelat', '2026-10-15 03:46:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-15 03:46:00', '2026-10-15 03:46:00', NULL),
(82, 23, 82, NULL, NULL, 'INIT-82', 'initial', 8, 8, 'available', NULL, NULL, 'Stok awal koleksi Jaket Kanvas Kerja Cokelat', '2026-10-15 03:46:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-15 03:46:00', '2026-10-15 03:46:00', NULL),
(83, 24, 83, NULL, NULL, 'INIT-83', 'initial', 23, 23, 'available', NULL, NULL, 'Stok awal koleksi Jaket Harrington Cotton Navy', '2026-10-13 04:59:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-13 04:59:00', '2026-10-13 04:59:00', NULL),
(84, 24, 84, NULL, NULL, 'INIT-84', 'initial', 34, 34, 'available', NULL, NULL, 'Stok awal koleksi Jaket Harrington Cotton Navy', '2026-10-13 04:59:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-13 04:59:00', '2026-10-13 04:59:00', NULL),
(85, 24, 85, NULL, NULL, 'INIT-85', 'initial', 45, 45, 'available', NULL, NULL, 'Stok awal koleksi Jaket Harrington Cotton Navy', '2026-10-13 04:59:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-13 04:59:00', '2026-10-13 04:59:00', NULL),
(86, 24, 86, NULL, NULL, 'INIT-86', 'initial', 14, 14, 'available', NULL, NULL, 'Stok awal koleksi Jaket Harrington Cotton Navy', '2026-10-13 04:59:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-13 04:59:00', '2026-10-13 04:59:00', NULL),
(87, 25, 87, NULL, NULL, 'INIT-87', 'initial', 18, 18, 'available', NULL, NULL, 'Stok awal koleksi Celana Chino Slim Fit Khaki', '2026-10-11 05:12:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-11 05:12:00', '2026-10-11 05:12:00', NULL),
(88, 25, 88, NULL, NULL, 'INIT-88', 'initial', 29, 29, 'available', NULL, NULL, 'Stok awal koleksi Celana Chino Slim Fit Khaki', '2026-10-11 05:12:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-11 05:12:00', '2026-10-11 05:12:00', NULL),
(89, 25, 89, NULL, NULL, 'INIT-89', 'initial', 40, 40, 'available', NULL, NULL, 'Stok awal koleksi Celana Chino Slim Fit Khaki', '2026-10-11 05:12:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-11 05:12:00', '2026-10-11 05:12:00', NULL),
(90, 25, 90, NULL, NULL, 'INIT-90', 'initial', 9, 9, 'available', NULL, NULL, 'Stok awal koleksi Celana Chino Slim Fit Khaki', '2026-10-11 05:12:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-11 05:12:00', '2026-10-11 05:12:00', NULL),
(91, 25, 91, NULL, NULL, 'INIT-91', 'initial', 20, 20, 'available', NULL, NULL, 'Stok awal koleksi Celana Chino Slim Fit Khaki', '2026-10-11 05:12:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-11 05:12:00', '2026-10-11 05:12:00', NULL),
(92, 25, 92, NULL, NULL, 'INIT-92', 'initial', 31, 31, 'available', NULL, NULL, 'Stok awal koleksi Celana Chino Slim Fit Khaki', '2026-10-11 05:12:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-11 05:12:00', '2026-10-11 05:12:00', NULL),
(93, 26, 93, NULL, NULL, 'INIT-93', 'initial', 13, 13, 'available', NULL, NULL, 'Stok awal koleksi Celana Jeans Straight Leg Indigo', '2026-10-09 06:25:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-09 06:25:00', '2026-10-09 06:25:00', NULL),
(94, 26, 94, NULL, NULL, 'INIT-94', 'initial', 24, 24, 'available', NULL, NULL, 'Stok awal koleksi Celana Jeans Straight Leg Indigo', '2026-10-09 06:25:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-09 06:25:00', '2026-10-09 06:25:00', NULL),
(95, 26, 95, NULL, NULL, 'INIT-95', 'initial', 35, 35, 'available', NULL, NULL, 'Stok awal koleksi Celana Jeans Straight Leg Indigo', '2026-10-09 06:25:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-09 06:25:00', '2026-10-09 06:25:00', NULL),
(96, 26, 96, NULL, NULL, 'INIT-96', 'initial', 46, 46, 'available', NULL, NULL, 'Stok awal koleksi Celana Jeans Straight Leg Indigo', '2026-10-09 06:25:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-09 06:25:00', '2026-10-09 06:25:00', NULL),
(97, 26, 97, NULL, NULL, 'INIT-97', 'initial', 15, 15, 'available', NULL, NULL, 'Stok awal koleksi Celana Jeans Straight Leg Indigo', '2026-10-09 06:25:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-09 06:25:00', '2026-10-09 06:25:00', NULL),
(98, 26, 98, NULL, NULL, 'INIT-98', 'initial', 26, 26, 'available', NULL, NULL, 'Stok awal koleksi Celana Jeans Straight Leg Indigo', '2026-10-09 06:25:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-09 06:25:00', '2026-10-09 06:25:00', NULL),
(99, 27, 99, NULL, NULL, 'INIT-99', 'initial', 8, 8, 'available', NULL, NULL, 'Stok awal koleksi Celana Cargo Ripstop Olive', '2026-10-07 07:38:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-07 07:38:00', '2026-10-07 07:38:00', NULL),
(100, 27, 100, NULL, NULL, 'INIT-100', 'initial', 19, 19, 'available', NULL, NULL, 'Stok awal koleksi Celana Cargo Ripstop Olive', '2026-10-07 07:38:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-07 07:38:00', '2026-10-07 07:38:00', NULL),
(101, 27, 101, NULL, NULL, 'INIT-101', 'initial', 30, 30, 'available', NULL, NULL, 'Stok awal koleksi Celana Cargo Ripstop Olive', '2026-10-07 07:38:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-07 07:38:00', '2026-10-07 07:38:00', NULL),
(102, 27, 102, NULL, NULL, 'INIT-102', 'initial', 41, 41, 'available', NULL, NULL, 'Stok awal koleksi Celana Cargo Ripstop Olive', '2026-10-07 07:38:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-07 07:38:00', '2026-10-07 07:38:00', NULL),
(103, 27, 103, NULL, NULL, 'INIT-103', 'initial', 10, 10, 'available', NULL, NULL, 'Stok awal koleksi Celana Cargo Ripstop Olive', '2026-10-07 07:38:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-07 07:38:00', '2026-10-07 07:38:00', NULL),
(104, 28, 104, NULL, NULL, 'INIT-104', 'initial', 45, 45, 'available', NULL, NULL, 'Stok awal koleksi Celana Formal Wool Blend Hitam', '2026-10-05 08:51:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-05 08:51:00', '2026-10-05 08:51:00', NULL),
(105, 28, 105, NULL, NULL, 'INIT-105', 'initial', 14, 14, 'available', NULL, NULL, 'Stok awal koleksi Celana Formal Wool Blend Hitam', '2026-10-05 08:51:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-05 08:51:00', '2026-10-05 08:51:00', NULL),
(106, 28, 106, NULL, NULL, 'INIT-106', 'initial', 25, 25, 'available', NULL, NULL, 'Stok awal koleksi Celana Formal Wool Blend Hitam', '2026-10-05 08:51:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-05 08:51:00', '2026-10-05 08:51:00', NULL),
(107, 28, 107, NULL, NULL, 'INIT-107', 'initial', 36, 36, 'available', NULL, NULL, 'Stok awal koleksi Celana Formal Wool Blend Hitam', '2026-10-05 08:51:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-05 08:51:00', '2026-10-05 08:51:00', NULL),
(108, 28, 108, NULL, NULL, 'INIT-108', 'initial', 47, 47, 'available', NULL, NULL, 'Stok awal koleksi Celana Formal Wool Blend Hitam', '2026-10-05 08:51:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-05 08:51:00', '2026-10-05 08:51:00', NULL),
(109, 29, 109, NULL, NULL, 'INIT-109', 'initial', 40, 40, 'available', NULL, NULL, 'Stok awal koleksi Celana Training Sweatpant Grey', '2026-10-03 09:04:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-03 09:04:00', '2026-10-03 09:04:00', NULL),
(110, 29, 110, NULL, NULL, 'INIT-110', 'initial', 9, 9, 'available', NULL, NULL, 'Stok awal koleksi Celana Training Sweatpant Grey', '2026-10-03 09:04:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-03 09:04:00', '2026-10-03 09:04:00', NULL),
(111, 29, 111, NULL, NULL, 'INIT-111', 'initial', 20, 20, 'available', NULL, NULL, 'Stok awal koleksi Celana Training Sweatpant Grey', '2026-10-03 09:04:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-03 09:04:00', '2026-10-03 09:04:00', NULL),
(112, 30, 112, NULL, NULL, 'INIT-112', 'initial', 35, 35, 'available', NULL, NULL, 'Stok awal koleksi Celana Panjang Kanvas Cokelat', '2026-10-01 10:17:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-01 10:17:00', '2026-10-01 10:17:00', NULL),
(113, 30, 113, NULL, NULL, 'INIT-113', 'initial', 46, 46, 'available', NULL, NULL, 'Stok awal koleksi Celana Panjang Kanvas Cokelat', '2026-10-01 10:17:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-01 10:17:00', '2026-10-01 10:17:00', NULL),
(114, 30, 114, NULL, NULL, 'INIT-114', 'initial', 15, 15, 'available', NULL, NULL, 'Stok awal koleksi Celana Panjang Kanvas Cokelat', '2026-10-01 10:17:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-01 10:17:00', '2026-10-01 10:17:00', NULL),
(115, 30, 115, NULL, NULL, 'INIT-115', 'initial', 26, 26, 'available', NULL, NULL, 'Stok awal koleksi Celana Panjang Kanvas Cokelat', '2026-10-01 10:17:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-01 10:17:00', '2026-10-01 10:17:00', NULL),
(116, 30, 116, NULL, NULL, 'INIT-116', 'initial', 37, 37, 'available', NULL, NULL, 'Stok awal koleksi Celana Panjang Kanvas Cokelat', '2026-10-01 10:17:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-01 10:17:00', '2026-10-01 10:17:00', NULL),
(117, 31, 117, NULL, NULL, 'INIT-117', 'initial', 30, 30, 'available', NULL, NULL, 'Stok awal koleksi Celana Jeans Slim Stretch Black', '2026-09-29 01:30:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-29 01:30:00', '2026-09-29 01:30:00', NULL),
(118, 31, 118, NULL, NULL, 'INIT-118', 'initial', 41, 41, 'available', NULL, NULL, 'Stok awal koleksi Celana Jeans Slim Stretch Black', '2026-09-29 01:30:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-29 01:30:00', '2026-09-29 01:30:00', NULL),
(119, 31, 119, NULL, NULL, 'INIT-119', 'initial', 10, 10, 'available', NULL, NULL, 'Stok awal koleksi Celana Jeans Slim Stretch Black', '2026-09-29 01:30:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-29 01:30:00', '2026-09-29 01:30:00', NULL),
(120, 31, 120, NULL, NULL, 'INIT-120', 'initial', 21, 21, 'available', NULL, NULL, 'Stok awal koleksi Celana Jeans Slim Stretch Black', '2026-09-29 01:30:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-29 01:30:00', '2026-09-29 01:30:00', NULL),
(121, 31, 121, NULL, NULL, 'INIT-121', 'initial', 32, 32, 'available', NULL, NULL, 'Stok awal koleksi Celana Jeans Slim Stretch Black', '2026-09-29 01:30:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-29 01:30:00', '2026-09-29 01:30:00', NULL),
(122, 31, 122, NULL, NULL, 'INIT-122', 'initial', 43, 43, 'available', NULL, NULL, 'Stok awal koleksi Celana Jeans Slim Stretch Black', '2026-09-29 01:30:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-29 01:30:00', '2026-09-29 01:30:00', NULL),
(123, 32, 123, NULL, NULL, 'INIT-123', 'initial', 25, 25, 'available', NULL, NULL, 'Stok awal koleksi Dress Midi Linen Krem', '2026-09-27 02:43:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-27 02:43:00', '2026-09-27 02:43:00', NULL),
(124, 32, 124, NULL, NULL, 'INIT-124', 'initial', 36, 36, 'available', NULL, NULL, 'Stok awal koleksi Dress Midi Linen Krem', '2026-09-27 02:43:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-27 02:43:00', '2026-09-27 02:43:00', NULL),
(125, 32, 125, NULL, NULL, 'INIT-125', 'initial', 47, 47, 'available', NULL, NULL, 'Stok awal koleksi Dress Midi Linen Krem', '2026-09-27 02:43:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-27 02:43:00', '2026-09-27 02:43:00', NULL),
(126, 32, 126, NULL, NULL, 'INIT-126', 'initial', 16, 16, 'available', NULL, NULL, 'Stok awal koleksi Dress Midi Linen Krem', '2026-09-27 02:43:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-27 02:43:00', '2026-09-27 02:43:00', NULL),
(127, 33, 127, NULL, NULL, 'INIT-127', 'initial', 20, 20, 'available', NULL, NULL, 'Stok awal koleksi Dress Slip Satin Champagne', '2026-09-25 03:56:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-25 03:56:00', '2026-09-25 03:56:00', NULL),
(128, 33, 128, NULL, NULL, 'INIT-128', 'initial', 31, 31, 'available', NULL, NULL, 'Stok awal koleksi Dress Slip Satin Champagne', '2026-09-25 03:56:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-25 03:56:00', '2026-09-25 03:56:00', NULL),
(129, 33, 129, NULL, NULL, 'INIT-129', 'initial', 42, 42, 'available', NULL, NULL, 'Stok awal koleksi Dress Slip Satin Champagne', '2026-09-25 03:56:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-25 03:56:00', '2026-09-25 03:56:00', NULL),
(130, 34, 130, NULL, NULL, 'INIT-130', 'initial', 15, 15, 'available', NULL, NULL, 'Stok awal koleksi Dress Wrap Floral Sage', '2026-09-23 04:09:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-23 04:09:00', '2026-09-23 04:09:00', NULL),
(131, 34, 131, NULL, NULL, 'INIT-131', 'initial', 26, 26, 'available', NULL, NULL, 'Stok awal koleksi Dress Wrap Floral Sage', '2026-09-23 04:09:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-23 04:09:00', '2026-09-23 04:09:00', NULL),
(132, 34, 132, NULL, NULL, 'INIT-132', 'initial', 37, 37, 'available', NULL, NULL, 'Stok awal koleksi Dress Wrap Floral Sage', '2026-09-23 04:09:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-23 04:09:00', '2026-09-23 04:09:00', NULL),
(133, 34, 133, NULL, NULL, 'INIT-133', 'initial', 6, 6, 'available', NULL, NULL, 'Stok awal koleksi Dress Wrap Floral Sage', '2026-09-23 04:09:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-23 04:09:00', '2026-09-23 04:09:00', NULL),
(134, 35, 134, NULL, NULL, 'INIT-134', 'initial', 10, 10, 'available', NULL, NULL, 'Stok awal koleksi Dress Shirt Midi Denim Light', '2026-09-21 05:22:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-21 05:22:00', '2026-09-21 05:22:00', NULL),
(135, 35, 135, NULL, NULL, 'INIT-135', 'initial', 21, 21, 'available', NULL, NULL, 'Stok awal koleksi Dress Shirt Midi Denim Light', '2026-09-21 05:22:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-21 05:22:00', '2026-09-21 05:22:00', NULL),
(136, 35, 136, NULL, NULL, 'INIT-136', 'initial', 32, 32, 'available', NULL, NULL, 'Stok awal koleksi Dress Shirt Midi Denim Light', '2026-09-21 05:22:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-21 05:22:00', '2026-09-21 05:22:00', NULL),
(137, 36, 137, NULL, NULL, 'INIT-137', 'initial', 47, 47, 'available', NULL, NULL, 'Stok awal koleksi Dress Maxi Katun Batik Parang', '2026-09-19 06:35:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-19 06:35:00', '2026-09-19 06:35:00', NULL),
(138, 36, 138, NULL, NULL, 'INIT-138', 'initial', 16, 16, 'available', NULL, NULL, 'Stok awal koleksi Dress Maxi Katun Batik Parang', '2026-09-19 06:35:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-19 06:35:00', '2026-09-19 06:35:00', NULL),
(139, 36, 139, NULL, NULL, 'INIT-139', 'initial', 27, 27, 'available', NULL, NULL, 'Stok awal koleksi Dress Maxi Katun Batik Parang', '2026-09-19 06:35:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-19 06:35:00', '2026-09-19 06:35:00', NULL),
(140, 36, 140, NULL, NULL, 'INIT-140', 'initial', 38, 38, 'available', NULL, NULL, 'Stok awal koleksi Dress Maxi Katun Batik Parang', '2026-09-19 06:35:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-19 06:35:00', '2026-09-19 06:35:00', NULL),
(141, 37, 141, NULL, NULL, 'INIT-141', 'initial', 42, 42, 'available', NULL, NULL, 'Stok awal koleksi Dress Bodycon Rib Hitam', '2026-09-17 07:48:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-17 07:48:00', '2026-09-17 07:48:00', NULL),
(142, 37, 142, NULL, NULL, 'INIT-142', 'initial', 11, 11, 'available', NULL, NULL, 'Stok awal koleksi Dress Bodycon Rib Hitam', '2026-09-17 07:48:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-17 07:48:00', '2026-09-17 07:48:00', NULL),
(143, 37, 143, NULL, NULL, 'INIT-143', 'initial', 22, 22, 'available', NULL, NULL, 'Stok awal koleksi Dress Bodycon Rib Hitam', '2026-09-17 07:48:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-17 07:48:00', '2026-09-17 07:48:00', NULL),
(144, 38, 144, NULL, NULL, 'INIT-144', 'initial', 37, 37, 'available', NULL, NULL, 'Stok awal koleksi Dress Sundress Tiered Gingham', '2026-09-15 08:01:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-15 08:01:00', '2026-09-15 08:01:00', NULL),
(145, 38, 145, NULL, NULL, 'INIT-145', 'initial', 6, 6, 'available', NULL, NULL, 'Stok awal koleksi Dress Sundress Tiered Gingham', '2026-09-15 08:01:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-15 08:01:00', '2026-09-15 08:01:00', NULL),
(146, 38, 146, NULL, NULL, 'INIT-146', 'initial', 17, 17, 'available', NULL, NULL, 'Stok awal koleksi Dress Sundress Tiered Gingham', '2026-09-15 08:01:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-15 08:01:00', '2026-09-15 08:01:00', NULL),
(147, 39, 147, NULL, NULL, 'INIT-147', 'initial', 32, 32, 'available', NULL, NULL, 'Stok awal koleksi Dress Kemeja Midi Khaki', '2026-09-13 09:14:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-13 09:14:00', '2026-09-13 09:14:00', NULL),
(148, 39, 148, NULL, NULL, 'INIT-148', 'initial', 43, 43, 'available', NULL, NULL, 'Stok awal koleksi Dress Kemeja Midi Khaki', '2026-09-13 09:14:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-13 09:14:00', '2026-09-13 09:14:00', NULL),
(149, 39, 149, NULL, NULL, 'INIT-149', 'initial', 12, 12, 'available', NULL, NULL, 'Stok awal koleksi Dress Kemeja Midi Khaki', '2026-09-13 09:14:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-13 09:14:00', '2026-09-13 09:14:00', NULL),
(150, 39, 150, NULL, NULL, 'INIT-150', 'initial', 23, 23, 'available', NULL, NULL, 'Stok awal koleksi Dress Kemeja Midi Khaki', '2026-09-13 09:14:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-13 09:14:00', '2026-09-13 09:14:00', NULL),
(151, 40, 151, NULL, NULL, 'INIT-151', 'initial', 27, 27, 'available', NULL, NULL, 'Stok awal koleksi Dress Off Shoulder Ruffle Terracotta', '2026-09-11 10:27:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-11 10:27:00', '2026-09-11 10:27:00', NULL),
(152, 40, 152, NULL, NULL, 'INIT-152', 'initial', 38, 38, 'available', NULL, NULL, 'Stok awal koleksi Dress Off Shoulder Ruffle Terracotta', '2026-09-11 10:27:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-11 10:27:00', '2026-09-11 10:27:00', NULL),
(153, 40, 153, NULL, NULL, 'INIT-153', 'initial', 7, 7, 'available', NULL, NULL, 'Stok awal koleksi Dress Off Shoulder Ruffle Terracotta', '2026-09-11 10:27:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-11 10:27:00', '2026-09-11 10:27:00', NULL),
(154, 41, 154, NULL, NULL, 'INIT-154', 'initial', 22, 22, 'available', NULL, NULL, 'Stok awal koleksi Blus Ruffle Satin Ivory', '2026-09-09 01:40:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-09 01:40:00', '2026-09-09 01:40:00', NULL),
(155, 41, 155, NULL, NULL, 'INIT-155', 'initial', 33, 33, 'available', NULL, NULL, 'Stok awal koleksi Blus Ruffle Satin Ivory', '2026-09-09 01:40:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-09 01:40:00', '2026-09-09 01:40:00', NULL),
(156, 41, 156, NULL, NULL, 'INIT-156', 'initial', 44, 44, 'available', NULL, NULL, 'Stok awal koleksi Blus Ruffle Satin Ivory', '2026-09-09 01:40:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-09 01:40:00', '2026-09-09 01:40:00', NULL),
(157, 41, 157, NULL, NULL, 'INIT-157', 'initial', 13, 13, 'available', NULL, NULL, 'Stok awal koleksi Blus Ruffle Satin Ivory', '2026-09-09 01:40:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-09 01:40:00', '2026-09-09 01:40:00', NULL),
(158, 42, 158, NULL, NULL, 'INIT-158', 'initial', 17, 17, 'available', NULL, NULL, 'Stok awal koleksi Blus Kerah Peter Pan Putih', '2026-09-07 02:53:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-07 02:53:00', '2026-09-07 02:53:00', NULL),
(159, 42, 159, NULL, NULL, 'INIT-159', 'initial', 28, 28, 'available', NULL, NULL, 'Stok awal koleksi Blus Kerah Peter Pan Putih', '2026-09-07 02:53:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-07 02:53:00', '2026-09-07 02:53:00', NULL),
(160, 42, 160, NULL, NULL, 'INIT-160', 'initial', 39, 39, 'available', NULL, NULL, 'Stok awal koleksi Blus Kerah Peter Pan Putih', '2026-09-07 02:53:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-07 02:53:00', '2026-09-07 02:53:00', NULL),
(161, 42, 161, NULL, NULL, 'INIT-161', 'initial', 8, 8, 'available', NULL, NULL, 'Stok awal koleksi Blus Kerah Peter Pan Putih', '2026-09-07 02:53:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-07 02:53:00', '2026-09-07 02:53:00', NULL),
(162, 43, 162, NULL, NULL, 'INIT-162', 'initial', 12, 12, 'available', NULL, NULL, 'Stok awal koleksi Blus Oversized Poplin Navy', '2026-09-05 03:06:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-05 03:06:00', '2026-09-05 03:06:00', NULL),
(163, 43, 163, NULL, NULL, 'INIT-163', 'initial', 23, 23, 'available', NULL, NULL, 'Stok awal koleksi Blus Oversized Poplin Navy', '2026-09-05 03:06:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-05 03:06:00', '2026-09-05 03:06:00', NULL),
(164, 43, 164, NULL, NULL, 'INIT-164', 'initial', 34, 34, 'available', NULL, NULL, 'Stok awal koleksi Blus Oversized Poplin Navy', '2026-09-05 03:06:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-05 03:06:00', '2026-09-05 03:06:00', NULL),
(165, 43, 165, NULL, NULL, 'INIT-165', 'initial', 45, 45, 'available', NULL, NULL, 'Stok awal koleksi Blus Oversized Poplin Navy', '2026-09-05 03:06:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-05 03:06:00', '2026-09-05 03:06:00', NULL),
(166, 44, 166, NULL, NULL, 'INIT-166', 'initial', 7, 7, 'available', NULL, NULL, 'Stok awal koleksi Blus Crop Boxy Cotton Pink', '2026-09-03 04:19:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-03 04:19:00', '2026-09-03 04:19:00', NULL),
(167, 44, 167, NULL, NULL, 'INIT-167', 'initial', 18, 18, 'available', NULL, NULL, 'Stok awal koleksi Blus Crop Boxy Cotton Pink', '2026-09-03 04:19:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-03 04:19:00', '2026-09-03 04:19:00', NULL),
(168, 44, 168, NULL, NULL, 'INIT-168', 'initial', 29, 29, 'available', NULL, NULL, 'Stok awal koleksi Blus Crop Boxy Cotton Pink', '2026-09-03 04:19:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-03 04:19:00', '2026-09-03 04:19:00', NULL),
(169, 45, 169, NULL, NULL, 'INIT-169', 'initial', 44, 44, 'available', NULL, NULL, 'Stok awal koleksi Blus Tie Front Viscose Dusty Blue', '2026-09-01 05:32:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-01 05:32:00', '2026-09-01 05:32:00', NULL),
(170, 45, 170, NULL, NULL, 'INIT-170', 'initial', 13, 13, 'available', NULL, NULL, 'Stok awal koleksi Blus Tie Front Viscose Dusty Blue', '2026-09-01 05:32:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-01 05:32:00', '2026-09-01 05:32:00', NULL),
(171, 45, 171, NULL, NULL, 'INIT-171', 'initial', 24, 24, 'available', NULL, NULL, 'Stok awal koleksi Blus Tie Front Viscose Dusty Blue', '2026-09-01 05:32:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-01 05:32:00', '2026-09-01 05:32:00', NULL),
(172, 46, 172, NULL, NULL, 'INIT-172', 'initial', 39, 39, 'available', NULL, NULL, 'Stok awal koleksi Blus Batik Cap Sleeve Cokelat', '2026-08-30 06:45:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-30 06:45:00', '2026-08-30 06:45:00', NULL),
(173, 46, 173, NULL, NULL, 'INIT-173', 'initial', 8, 8, 'available', NULL, NULL, 'Stok awal koleksi Blus Batik Cap Sleeve Cokelat', '2026-08-30 06:45:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-30 06:45:00', '2026-08-30 06:45:00', NULL),
(174, 46, 174, NULL, NULL, 'INIT-174', 'initial', 19, 19, 'available', NULL, NULL, 'Stok awal koleksi Blus Batik Cap Sleeve Cokelat', '2026-08-30 06:45:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-30 06:45:00', '2026-08-30 06:45:00', NULL),
(175, 46, 175, NULL, NULL, 'INIT-175', 'initial', 30, 30, 'available', NULL, NULL, 'Stok awal koleksi Blus Batik Cap Sleeve Cokelat', '2026-08-30 06:45:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-30 06:45:00', '2026-08-30 06:45:00', NULL),
(176, 47, 176, NULL, NULL, 'INIT-176', 'initial', 34, 34, 'available', NULL, NULL, 'Stok awal koleksi Blus Knit Cropped Cream', '2026-08-28 07:58:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-28 07:58:00', '2026-08-28 07:58:00', NULL),
(177, 47, 177, NULL, NULL, 'INIT-177', 'initial', 45, 45, 'available', NULL, NULL, 'Stok awal koleksi Blus Knit Cropped Cream', '2026-08-28 07:58:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-28 07:58:00', '2026-08-28 07:58:00', NULL),
(178, 47, 178, NULL, NULL, 'INIT-178', 'initial', 14, 14, 'available', NULL, NULL, 'Stok awal koleksi Blus Knit Cropped Cream', '2026-08-28 07:58:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-28 07:58:00', '2026-08-28 07:58:00', NULL),
(179, 48, 179, NULL, NULL, 'INIT-179', 'initial', 29, 29, 'available', NULL, NULL, 'Stok awal koleksi Blus Peplum Formal Hitam', '2026-08-26 08:11:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-26 08:11:00', '2026-08-26 08:11:00', NULL),
(180, 48, 180, NULL, NULL, 'INIT-180', 'initial', 40, 40, 'available', NULL, NULL, 'Stok awal koleksi Blus Peplum Formal Hitam', '2026-08-26 08:11:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-26 08:11:00', '2026-08-26 08:11:00', NULL),
(181, 48, 181, NULL, NULL, 'INIT-181', 'initial', 9, 9, 'available', NULL, NULL, 'Stok awal koleksi Blus Peplum Formal Hitam', '2026-08-26 08:11:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-26 08:11:00', '2026-08-26 08:11:00', NULL),
(182, 48, 182, NULL, NULL, 'INIT-182', 'initial', 20, 20, 'available', NULL, NULL, 'Stok awal koleksi Blus Peplum Formal Hitam', '2026-08-26 08:11:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-26 08:11:00', '2026-08-26 08:11:00', NULL),
(183, 49, 183, NULL, NULL, 'INIT-183', 'initial', 24, 24, 'available', NULL, NULL, 'Stok awal koleksi Rok Plisket Midi Hitam', '2026-08-24 09:24:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-24 09:24:00', '2026-08-24 09:24:00', NULL),
(184, 49, 184, NULL, NULL, 'INIT-184', 'initial', 35, 35, 'available', NULL, NULL, 'Stok awal koleksi Rok Plisket Midi Hitam', '2026-08-24 09:24:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-24 09:24:00', '2026-08-24 09:24:00', NULL),
(185, 49, 185, NULL, NULL, 'INIT-185', 'initial', 46, 46, 'available', NULL, NULL, 'Stok awal koleksi Rok Plisket Midi Hitam', '2026-08-24 09:24:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-24 09:24:00', '2026-08-24 09:24:00', NULL),
(186, 49, 186, NULL, NULL, 'INIT-186', 'initial', 15, 15, 'available', NULL, NULL, 'Stok awal koleksi Rok Plisket Midi Hitam', '2026-08-24 09:24:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-24 09:24:00', '2026-08-24 09:24:00', NULL),
(187, 50, 187, NULL, NULL, 'INIT-187', 'initial', 19, 19, 'available', NULL, NULL, 'Stok awal koleksi Rok Denim A-Line Mid Blue', '2026-08-22 10:37:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-22 10:37:00', '2026-08-22 10:37:00', NULL),
(188, 50, 188, NULL, NULL, 'INIT-188', 'initial', 30, 30, 'available', NULL, NULL, 'Stok awal koleksi Rok Denim A-Line Mid Blue', '2026-08-22 10:37:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-22 10:37:00', '2026-08-22 10:37:00', NULL),
(189, 50, 189, NULL, NULL, 'INIT-189', 'initial', 41, 41, 'available', NULL, NULL, 'Stok awal koleksi Rok Denim A-Line Mid Blue', '2026-08-22 10:37:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-22 10:37:00', '2026-08-22 10:37:00', NULL),
(190, 50, 190, NULL, NULL, 'INIT-190', 'initial', 10, 10, 'available', NULL, NULL, 'Stok awal koleksi Rok Denim A-Line Mid Blue', '2026-08-22 10:37:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-22 10:37:00', '2026-08-22 10:37:00', NULL),
(191, 51, 191, NULL, NULL, 'INIT-191', 'initial', 14, 14, 'available', NULL, NULL, 'Stok awal koleksi Rok Span Mini Kulot Hitam', '2026-08-20 01:50:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-20 01:50:00', '2026-08-20 01:50:00', NULL),
(192, 51, 192, NULL, NULL, 'INIT-192', 'initial', 25, 25, 'available', NULL, NULL, 'Stok awal koleksi Rok Span Mini Kulot Hitam', '2026-08-20 01:50:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-20 01:50:00', '2026-08-20 01:50:00', NULL),
(193, 51, 193, NULL, NULL, 'INIT-193', 'initial', 36, 36, 'available', NULL, NULL, 'Stok awal koleksi Rok Span Mini Kulot Hitam', '2026-08-20 01:50:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-20 01:50:00', '2026-08-20 01:50:00', NULL),
(194, 52, 194, NULL, NULL, 'INIT-194', 'initial', 9, 9, 'available', NULL, NULL, 'Stok awal koleksi Rok Linen Panjang Sage', '2026-08-18 02:03:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-18 02:03:00', '2026-08-18 02:03:00', NULL),
(195, 52, 195, NULL, NULL, 'INIT-195', 'initial', 20, 20, 'available', NULL, NULL, 'Stok awal koleksi Rok Linen Panjang Sage', '2026-08-18 02:03:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-18 02:03:00', '2026-08-18 02:03:00', NULL),
(196, 52, 196, NULL, NULL, 'INIT-196', 'initial', 31, 31, 'available', NULL, NULL, 'Stok awal koleksi Rok Linen Panjang Sage', '2026-08-18 02:03:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-18 02:03:00', '2026-08-18 02:03:00', NULL),
(197, 52, 197, NULL, NULL, 'INIT-197', 'initial', 42, 42, 'available', NULL, NULL, 'Stok awal koleksi Rok Linen Panjang Sage', '2026-08-18 02:03:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-18 02:03:00', '2026-08-18 02:03:00', NULL),
(198, 53, 198, NULL, NULL, 'INIT-198', 'initial', 46, 46, 'available', NULL, NULL, 'Stok awal koleksi Rok Batik Lilit Motif Kawung', '2026-08-16 03:16:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-16 03:16:00', '2026-08-16 03:16:00', NULL);
INSERT INTO `stock_movements` (`id`, `product_id`, `variant_id`, `order_id`, `order_item_id`, `movement_key`, `type`, `quantity_delta`, `balance_after`, `stock_dimension`, `reference_type`, `reference_id`, `notes`, `occurred_at`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(199, 53, 199, NULL, NULL, 'INIT-199', 'initial', 15, 15, 'available', NULL, NULL, 'Stok awal koleksi Rok Batik Lilit Motif Kawung', '2026-08-16 03:16:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-16 03:16:00', '2026-08-16 03:16:00', NULL),
(200, 53, 200, NULL, NULL, 'INIT-200', 'initial', 26, 26, 'available', NULL, NULL, 'Stok awal koleksi Rok Batik Lilit Motif Kawung', '2026-08-16 03:16:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-16 03:16:00', '2026-08-16 03:16:00', NULL),
(201, 53, 201, NULL, NULL, 'INIT-201', 'initial', 37, 37, 'available', NULL, NULL, 'Stok awal koleksi Rok Batik Lilit Motif Kawung', '2026-08-16 03:16:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-16 03:16:00', '2026-08-16 03:16:00', NULL),
(202, 54, 202, NULL, NULL, 'INIT-202', 'initial', 41, 41, 'available', NULL, NULL, 'Stok awal koleksi Blazer Oversized Linen Oat', '2026-08-14 04:29:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-14 04:29:00', '2026-08-14 04:29:00', NULL),
(203, 54, 203, NULL, NULL, 'INIT-203', 'initial', 10, 10, 'available', NULL, NULL, 'Stok awal koleksi Blazer Oversized Linen Oat', '2026-08-14 04:29:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-14 04:29:00', '2026-08-14 04:29:00', NULL),
(204, 54, 204, NULL, NULL, 'INIT-204', 'initial', 21, 21, 'available', NULL, NULL, 'Stok awal koleksi Blazer Oversized Linen Oat', '2026-08-14 04:29:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-14 04:29:00', '2026-08-14 04:29:00', NULL),
(205, 54, 205, NULL, NULL, 'INIT-205', 'initial', 32, 32, 'available', NULL, NULL, 'Stok awal koleksi Blazer Oversized Linen Oat', '2026-08-14 04:29:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-14 04:29:00', '2026-08-14 04:29:00', NULL),
(206, 55, 206, NULL, NULL, 'INIT-206', 'initial', 36, 36, 'available', NULL, NULL, 'Stok awal koleksi Cardigan Rajut Cropped Mocca', '2026-08-12 05:42:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-12 05:42:00', '2026-08-12 05:42:00', NULL),
(207, 55, 207, NULL, NULL, 'INIT-207', 'initial', 47, 47, 'available', NULL, NULL, 'Stok awal koleksi Cardigan Rajut Cropped Mocca', '2026-08-12 05:42:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-12 05:42:00', '2026-08-12 05:42:00', NULL),
(208, 55, 208, NULL, NULL, 'INIT-208', 'initial', 16, 16, 'available', NULL, NULL, 'Stok awal koleksi Cardigan Rajut Cropped Mocca', '2026-08-12 05:42:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-12 05:42:00', '2026-08-12 05:42:00', NULL),
(209, 56, 209, NULL, NULL, 'INIT-209', 'initial', 31, 31, 'available', NULL, NULL, 'Stok awal koleksi Trench Coat Katun Khaki', '2026-08-10 06:55:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-10 06:55:00', '2026-08-10 06:55:00', NULL),
(210, 56, 210, NULL, NULL, 'INIT-210', 'initial', 42, 42, 'available', NULL, NULL, 'Stok awal koleksi Trench Coat Katun Khaki', '2026-08-10 06:55:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-10 06:55:00', '2026-08-10 06:55:00', NULL),
(211, 56, 211, NULL, NULL, 'INIT-211', 'initial', 11, 11, 'available', NULL, NULL, 'Stok awal koleksi Trench Coat Katun Khaki', '2026-08-10 06:55:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-10 06:55:00', '2026-08-10 06:55:00', NULL),
(212, 56, 212, NULL, NULL, 'INIT-212', 'initial', 22, 22, 'available', NULL, NULL, 'Stok awal koleksi Trench Coat Katun Khaki', '2026-08-10 06:55:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-10 06:55:00', '2026-08-10 06:55:00', NULL),
(213, 57, 213, NULL, NULL, 'INIT-213', 'initial', 26, 26, 'available', NULL, NULL, 'Stok awal koleksi Bomber Satin Wanita Sage', '2026-08-08 07:08:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-08 07:08:00', '2026-08-08 07:08:00', NULL),
(214, 57, 214, NULL, NULL, 'INIT-214', 'initial', 37, 37, 'available', NULL, NULL, 'Stok awal koleksi Bomber Satin Wanita Sage', '2026-08-08 07:08:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-08 07:08:00', '2026-08-08 07:08:00', NULL),
(215, 57, 215, NULL, NULL, 'INIT-215', 'initial', 6, 6, 'available', NULL, NULL, 'Stok awal koleksi Bomber Satin Wanita Sage', '2026-08-08 07:08:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-08 07:08:00', '2026-08-08 07:08:00', NULL),
(216, 58, 216, NULL, NULL, 'INIT-216', 'initial', 21, 21, 'available', NULL, NULL, 'Stok awal koleksi Kimono Rayon Floral', '2026-08-06 08:21:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-06 08:21:00', '2026-08-06 08:21:00', NULL),
(217, 58, 217, NULL, NULL, 'INIT-217', 'initial', 32, 32, 'available', NULL, NULL, 'Stok awal koleksi Kimono Rayon Floral', '2026-08-06 08:21:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-06 08:21:00', '2026-08-06 08:21:00', NULL),
(218, 58, 218, NULL, NULL, 'INIT-218', 'initial', 43, 43, 'available', NULL, NULL, 'Stok awal koleksi Kimono Rayon Floral', '2026-08-06 08:21:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-06 08:21:00', '2026-08-06 08:21:00', NULL),
(219, 58, 219, NULL, NULL, 'INIT-219', 'initial', 12, 12, 'available', NULL, NULL, 'Stok awal koleksi Kimono Rayon Floral', '2026-08-06 08:21:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-06 08:21:00', '2026-08-06 08:21:00', NULL),
(220, 59, 220, NULL, NULL, 'INIT-220', 'initial', 16, 16, 'available', NULL, NULL, 'Stok awal koleksi Sneakers Canvas Low Putih', '2026-08-04 09:34:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-04 09:34:00', '2026-08-04 09:34:00', NULL),
(221, 59, 221, NULL, NULL, 'INIT-221', 'initial', 27, 27, 'available', NULL, NULL, 'Stok awal koleksi Sneakers Canvas Low Putih', '2026-08-04 09:34:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-04 09:34:00', '2026-08-04 09:34:00', NULL),
(222, 59, 222, NULL, NULL, 'INIT-222', 'initial', 38, 38, 'available', NULL, NULL, 'Stok awal koleksi Sneakers Canvas Low Putih', '2026-08-04 09:34:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-04 09:34:00', '2026-08-04 09:34:00', NULL),
(223, 59, 223, NULL, NULL, 'INIT-223', 'initial', 7, 7, 'available', NULL, NULL, 'Stok awal koleksi Sneakers Canvas Low Putih', '2026-08-04 09:34:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-04 09:34:00', '2026-08-04 09:34:00', NULL),
(224, 59, 224, NULL, NULL, 'INIT-224', 'initial', 18, 18, 'available', NULL, NULL, 'Stok awal koleksi Sneakers Canvas Low Putih', '2026-08-04 09:34:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-04 09:34:00', '2026-08-04 09:34:00', NULL),
(225, 59, 225, NULL, NULL, 'INIT-225', 'initial', 29, 29, 'available', NULL, NULL, 'Stok awal koleksi Sneakers Canvas Low Putih', '2026-08-04 09:34:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-04 09:34:00', '2026-08-04 09:34:00', NULL),
(226, 60, 226, NULL, NULL, 'INIT-226', 'initial', 11, 11, 'available', NULL, NULL, 'Stok awal koleksi Sneakers Chunky Retro Silver', '2026-08-02 10:47:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-02 10:47:00', '2026-08-02 10:47:00', NULL),
(227, 60, 227, NULL, NULL, 'INIT-227', 'initial', 22, 22, 'available', NULL, NULL, 'Stok awal koleksi Sneakers Chunky Retro Silver', '2026-08-02 10:47:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-02 10:47:00', '2026-08-02 10:47:00', NULL),
(228, 60, 228, NULL, NULL, 'INIT-228', 'initial', 33, 33, 'available', NULL, NULL, 'Stok awal koleksi Sneakers Chunky Retro Silver', '2026-08-02 10:47:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-02 10:47:00', '2026-08-02 10:47:00', NULL),
(229, 60, 229, NULL, NULL, 'INIT-229', 'initial', 44, 44, 'available', NULL, NULL, 'Stok awal koleksi Sneakers Chunky Retro Silver', '2026-08-02 10:47:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-02 10:47:00', '2026-08-02 10:47:00', NULL),
(230, 60, 230, NULL, NULL, 'INIT-230', 'initial', 13, 13, 'available', NULL, NULL, 'Stok awal koleksi Sneakers Chunky Retro Silver', '2026-08-02 10:47:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-08-02 10:47:00', '2026-08-02 10:47:00', NULL),
(231, 61, 231, NULL, NULL, 'INIT-231', 'initial', 6, 6, 'available', NULL, NULL, 'Stok awal koleksi Sepatu Kulit Formal Oxford Hitam', '2026-07-31 01:00:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-31 01:00:00', '2026-07-31 01:00:00', NULL),
(232, 61, 232, NULL, NULL, 'INIT-232', 'initial', 17, 17, 'available', NULL, NULL, 'Stok awal koleksi Sepatu Kulit Formal Oxford Hitam', '2026-07-31 01:00:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-31 01:00:00', '2026-07-31 01:00:00', NULL),
(233, 61, 233, NULL, NULL, 'INIT-233', 'initial', 28, 28, 'available', NULL, NULL, 'Stok awal koleksi Sepatu Kulit Formal Oxford Hitam', '2026-07-31 01:00:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-31 01:00:00', '2026-07-31 01:00:00', NULL),
(234, 61, 234, NULL, NULL, 'INIT-234', 'initial', 39, 39, 'available', NULL, NULL, 'Stok awal koleksi Sepatu Kulit Formal Oxford Hitam', '2026-07-31 01:00:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-31 01:00:00', '2026-07-31 01:00:00', NULL),
(235, 61, 235, NULL, NULL, 'INIT-235', 'initial', 8, 8, 'available', NULL, NULL, 'Stok awal koleksi Sepatu Kulit Formal Oxford Hitam', '2026-07-31 01:00:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-31 01:00:00', '2026-07-31 01:00:00', NULL),
(236, 62, 236, NULL, NULL, 'INIT-236', 'initial', 43, 43, 'available', NULL, NULL, 'Stok awal koleksi Loafers Kulit Sintetis Cokelat', '2026-07-29 02:13:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-29 02:13:00', '2026-07-29 02:13:00', NULL),
(237, 62, 237, NULL, NULL, 'INIT-237', 'initial', 12, 12, 'available', NULL, NULL, 'Stok awal koleksi Loafers Kulit Sintetis Cokelat', '2026-07-29 02:13:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-29 02:13:00', '2026-07-29 02:13:00', NULL),
(238, 62, 238, NULL, NULL, 'INIT-238', 'initial', 23, 23, 'available', NULL, NULL, 'Stok awal koleksi Loafers Kulit Sintetis Cokelat', '2026-07-29 02:13:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-29 02:13:00', '2026-07-29 02:13:00', NULL),
(239, 62, 239, NULL, NULL, 'INIT-239', 'initial', 34, 34, 'available', NULL, NULL, 'Stok awal koleksi Loafers Kulit Sintetis Cokelat', '2026-07-29 02:13:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-29 02:13:00', '2026-07-29 02:13:00', NULL),
(240, 62, 240, NULL, NULL, 'INIT-240', 'initial', 45, 45, 'available', NULL, NULL, 'Stok awal koleksi Loafers Kulit Sintetis Cokelat', '2026-07-29 02:13:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-29 02:13:00', '2026-07-29 02:13:00', NULL),
(241, 63, 241, NULL, NULL, 'INIT-241', 'initial', 38, 38, 'available', NULL, NULL, 'Stok awal koleksi Pantofel Kulit Asli Navy', '2026-07-27 03:26:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-27 03:26:00', '2026-07-27 03:26:00', NULL),
(242, 63, 242, NULL, NULL, 'INIT-242', 'initial', 7, 7, 'available', NULL, NULL, 'Stok awal koleksi Pantofel Kulit Asli Navy', '2026-07-27 03:26:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-27 03:26:00', '2026-07-27 03:26:00', NULL),
(243, 63, 243, NULL, NULL, 'INIT-243', 'initial', 18, 18, 'available', NULL, NULL, 'Stok awal koleksi Pantofel Kulit Asli Navy', '2026-07-27 03:26:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-27 03:26:00', '2026-07-27 03:26:00', NULL),
(244, 63, 244, NULL, NULL, 'INIT-244', 'initial', 29, 29, 'available', NULL, NULL, 'Stok awal koleksi Pantofel Kulit Asli Navy', '2026-07-27 03:26:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-27 03:26:00', '2026-07-27 03:26:00', NULL),
(245, 63, 245, NULL, NULL, 'INIT-245', 'initial', 40, 40, 'available', NULL, NULL, 'Stok awal koleksi Pantofel Kulit Asli Navy', '2026-07-27 03:26:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-27 03:26:00', '2026-07-27 03:26:00', NULL),
(246, 64, 246, NULL, NULL, 'INIT-246', 'initial', 33, 33, 'available', NULL, NULL, 'Stok awal koleksi Boots Chelsea Kulit Cokelat', '2026-07-25 04:39:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-25 04:39:00', '2026-07-25 04:39:00', NULL),
(247, 64, 247, NULL, NULL, 'INIT-247', 'initial', 44, 44, 'available', NULL, NULL, 'Stok awal koleksi Boots Chelsea Kulit Cokelat', '2026-07-25 04:39:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-25 04:39:00', '2026-07-25 04:39:00', NULL),
(248, 64, 248, NULL, NULL, 'INIT-248', 'initial', 13, 13, 'available', NULL, NULL, 'Stok awal koleksi Boots Chelsea Kulit Cokelat', '2026-07-25 04:39:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-25 04:39:00', '2026-07-25 04:39:00', NULL),
(249, 64, 249, NULL, NULL, 'INIT-249', 'initial', 24, 24, 'available', NULL, NULL, 'Stok awal koleksi Boots Chelsea Kulit Cokelat', '2026-07-25 04:39:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-25 04:39:00', '2026-07-25 04:39:00', NULL),
(250, 64, 250, NULL, NULL, 'INIT-250', 'initial', 35, 35, 'available', NULL, NULL, 'Stok awal koleksi Boots Chelsea Kulit Cokelat', '2026-07-25 04:39:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-25 04:39:00', '2026-07-25 04:39:00', NULL),
(251, 65, 251, NULL, NULL, 'INIT-251', 'initial', 28, 28, 'available', NULL, NULL, 'Stok awal koleksi Boots Hiking Waterproof Brown', '2026-07-23 05:52:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-23 05:52:00', '2026-07-23 05:52:00', NULL),
(252, 65, 252, NULL, NULL, 'INIT-252', 'initial', 39, 39, 'available', NULL, NULL, 'Stok awal koleksi Boots Hiking Waterproof Brown', '2026-07-23 05:52:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-23 05:52:00', '2026-07-23 05:52:00', NULL),
(253, 65, 253, NULL, NULL, 'INIT-253', 'initial', 8, 8, 'available', NULL, NULL, 'Stok awal koleksi Boots Hiking Waterproof Brown', '2026-07-23 05:52:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-23 05:52:00', '2026-07-23 05:52:00', NULL),
(254, 65, 254, NULL, NULL, 'INIT-254', 'initial', 19, 19, 'available', NULL, NULL, 'Stok awal koleksi Boots Hiking Waterproof Brown', '2026-07-23 05:52:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-23 05:52:00', '2026-07-23 05:52:00', NULL),
(255, 65, 255, NULL, NULL, 'INIT-255', 'initial', 30, 30, 'available', NULL, NULL, 'Stok awal koleksi Boots Hiking Waterproof Brown', '2026-07-23 05:52:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-23 05:52:00', '2026-07-23 05:52:00', NULL),
(256, 66, 256, NULL, NULL, 'INIT-256', 'initial', 23, 23, 'available', NULL, NULL, 'Stok awal koleksi Sneakers Running Knit Abu', '2026-07-21 06:05:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-21 06:05:00', '2026-07-21 06:05:00', NULL),
(257, 66, 257, NULL, NULL, 'INIT-257', 'initial', 34, 34, 'available', NULL, NULL, 'Stok awal koleksi Sneakers Running Knit Abu', '2026-07-21 06:05:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-21 06:05:00', '2026-07-21 06:05:00', NULL),
(258, 66, 258, NULL, NULL, 'INIT-258', 'initial', 45, 45, 'available', NULL, NULL, 'Stok awal koleksi Sneakers Running Knit Abu', '2026-07-21 06:05:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-21 06:05:00', '2026-07-21 06:05:00', NULL),
(259, 66, 259, NULL, NULL, 'INIT-259', 'initial', 14, 14, 'available', NULL, NULL, 'Stok awal koleksi Sneakers Running Knit Abu', '2026-07-21 06:05:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-21 06:05:00', '2026-07-21 06:05:00', NULL),
(260, 66, 260, NULL, NULL, 'INIT-260', 'initial', 25, 25, 'available', NULL, NULL, 'Stok awal koleksi Sneakers Running Knit Abu', '2026-07-21 06:05:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-21 06:05:00', '2026-07-21 06:05:00', NULL),
(261, 67, 261, NULL, NULL, 'INIT-261', 'initial', 18, 18, 'available', NULL, NULL, 'Stok awal koleksi Wedges Kanvas Krem', '2026-07-19 07:18:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-19 07:18:00', '2026-07-19 07:18:00', NULL),
(262, 67, 262, NULL, NULL, 'INIT-262', 'initial', 29, 29, 'available', NULL, NULL, 'Stok awal koleksi Wedges Kanvas Krem', '2026-07-19 07:18:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-19 07:18:00', '2026-07-19 07:18:00', NULL),
(263, 67, 263, NULL, NULL, 'INIT-263', 'initial', 40, 40, 'available', NULL, NULL, 'Stok awal koleksi Wedges Kanvas Krem', '2026-07-19 07:18:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-19 07:18:00', '2026-07-19 07:18:00', NULL),
(264, 67, 264, NULL, NULL, 'INIT-264', 'initial', 9, 9, 'available', NULL, NULL, 'Stok awal koleksi Wedges Kanvas Krem', '2026-07-19 07:18:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-19 07:18:00', '2026-07-19 07:18:00', NULL),
(265, 67, 265, NULL, NULL, 'INIT-265', 'initial', 20, 20, 'available', NULL, NULL, 'Stok awal koleksi Wedges Kanvas Krem', '2026-07-19 07:18:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-19 07:18:00', '2026-07-19 07:18:00', NULL),
(266, 68, 266, NULL, NULL, 'INIT-266', 'initial', 13, 13, 'available', NULL, NULL, 'Stok awal koleksi Heels Blok Tali Hitam', '2026-07-17 08:31:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-17 08:31:00', '2026-07-17 08:31:00', NULL),
(267, 68, 267, NULL, NULL, 'INIT-267', 'initial', 24, 24, 'available', NULL, NULL, 'Stok awal koleksi Heels Blok Tali Hitam', '2026-07-17 08:31:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-17 08:31:00', '2026-07-17 08:31:00', NULL),
(268, 68, 268, NULL, NULL, 'INIT-268', 'initial', 35, 35, 'available', NULL, NULL, 'Stok awal koleksi Heels Blok Tali Hitam', '2026-07-17 08:31:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-17 08:31:00', '2026-07-17 08:31:00', NULL),
(269, 68, 269, NULL, NULL, 'INIT-269', 'initial', 46, 46, 'available', NULL, NULL, 'Stok awal koleksi Heels Blok Tali Hitam', '2026-07-17 08:31:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-17 08:31:00', '2026-07-17 08:31:00', NULL),
(270, 68, 270, NULL, NULL, 'INIT-270', 'initial', 15, 15, 'available', NULL, NULL, 'Stok awal koleksi Heels Blok Tali Hitam', '2026-07-17 08:31:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-17 08:31:00', '2026-07-17 08:31:00', NULL),
(271, 69, 271, NULL, NULL, 'INIT-271', 'initial', 8, 8, 'available', NULL, NULL, 'Stok awal koleksi Sneakers Slip-On Denim', '2026-07-15 09:44:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-15 09:44:00', '2026-07-15 09:44:00', NULL),
(272, 69, 272, NULL, NULL, 'INIT-272', 'initial', 19, 19, 'available', NULL, NULL, 'Stok awal koleksi Sneakers Slip-On Denim', '2026-07-15 09:44:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-15 09:44:00', '2026-07-15 09:44:00', NULL),
(273, 69, 273, NULL, NULL, 'INIT-273', 'initial', 30, 30, 'available', NULL, NULL, 'Stok awal koleksi Sneakers Slip-On Denim', '2026-07-15 09:44:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-15 09:44:00', '2026-07-15 09:44:00', NULL),
(274, 69, 274, NULL, NULL, 'INIT-274', 'initial', 41, 41, 'available', NULL, NULL, 'Stok awal koleksi Sneakers Slip-On Denim', '2026-07-15 09:44:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-15 09:44:00', '2026-07-15 09:44:00', NULL),
(275, 69, 275, NULL, NULL, 'INIT-275', 'initial', 10, 10, 'available', NULL, NULL, 'Stok awal koleksi Sneakers Slip-On Denim', '2026-07-15 09:44:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-15 09:44:00', '2026-07-15 09:44:00', NULL),
(276, 69, 276, NULL, NULL, 'INIT-276', 'initial', 21, 21, 'available', NULL, NULL, 'Stok awal koleksi Sneakers Slip-On Denim', '2026-07-15 09:44:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-15 09:44:00', '2026-07-15 09:44:00', NULL),
(277, 70, 277, NULL, NULL, 'INIT-277', 'initial', 45, 45, 'available', NULL, NULL, 'Stok awal koleksi Pantofel Wanita Nude', '2026-07-13 10:57:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-13 10:57:00', '2026-07-13 10:57:00', NULL),
(278, 70, 278, NULL, NULL, 'INIT-278', 'initial', 14, 14, 'available', NULL, NULL, 'Stok awal koleksi Pantofel Wanita Nude', '2026-07-13 10:57:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-13 10:57:00', '2026-07-13 10:57:00', NULL),
(279, 70, 279, NULL, NULL, 'INIT-279', 'initial', 25, 25, 'available', NULL, NULL, 'Stok awal koleksi Pantofel Wanita Nude', '2026-07-13 10:57:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-13 10:57:00', '2026-07-13 10:57:00', NULL),
(280, 70, 280, NULL, NULL, 'INIT-280', 'initial', 36, 36, 'available', NULL, NULL, 'Stok awal koleksi Pantofel Wanita Nude', '2026-07-13 10:57:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-13 10:57:00', '2026-07-13 10:57:00', NULL),
(281, 70, 281, NULL, NULL, 'INIT-281', 'initial', 47, 47, 'available', NULL, NULL, 'Stok awal koleksi Pantofel Wanita Nude', '2026-07-13 10:57:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-13 10:57:00', '2026-07-13 10:57:00', NULL),
(282, 71, 282, NULL, NULL, 'INIT-282', 'initial', 40, 40, 'available', NULL, NULL, 'Stok awal koleksi Sandal Slide Puffy Hitam', '2026-07-11 01:10:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-11 01:10:00', '2026-07-11 01:10:00', NULL),
(283, 71, 283, NULL, NULL, 'INIT-283', 'initial', 9, 9, 'available', NULL, NULL, 'Stok awal koleksi Sandal Slide Puffy Hitam', '2026-07-11 01:10:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-11 01:10:00', '2026-07-11 01:10:00', NULL),
(284, 71, 284, NULL, NULL, 'INIT-284', 'initial', 20, 20, 'available', NULL, NULL, 'Stok awal koleksi Sandal Slide Puffy Hitam', '2026-07-11 01:10:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-11 01:10:00', '2026-07-11 01:10:00', NULL),
(285, 71, 285, NULL, NULL, 'INIT-285', 'initial', 31, 31, 'available', NULL, NULL, 'Stok awal koleksi Sandal Slide Puffy Hitam', '2026-07-11 01:10:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-11 01:10:00', '2026-07-11 01:10:00', NULL),
(286, 71, 286, NULL, NULL, 'INIT-286', 'initial', 42, 42, 'available', NULL, NULL, 'Stok awal koleksi Sandal Slide Puffy Hitam', '2026-07-11 01:10:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-11 01:10:00', '2026-07-11 01:10:00', NULL),
(287, 71, 287, NULL, NULL, 'INIT-287', 'initial', 11, 11, 'available', NULL, NULL, 'Stok awal koleksi Sandal Slide Puffy Hitam', '2026-07-11 01:10:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-11 01:10:00', '2026-07-11 01:10:00', NULL),
(288, 72, 288, NULL, NULL, 'INIT-288', 'initial', 35, 35, 'available', NULL, NULL, 'Stok awal koleksi Sandal Kulit Tali Silang Cokelat', '2026-07-09 02:23:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-09 02:23:00', '2026-07-09 02:23:00', NULL),
(289, 72, 289, NULL, NULL, 'INIT-289', 'initial', 46, 46, 'available', NULL, NULL, 'Stok awal koleksi Sandal Kulit Tali Silang Cokelat', '2026-07-09 02:23:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-09 02:23:00', '2026-07-09 02:23:00', NULL),
(290, 72, 290, NULL, NULL, 'INIT-290', 'initial', 15, 15, 'available', NULL, NULL, 'Stok awal koleksi Sandal Kulit Tali Silang Cokelat', '2026-07-09 02:23:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-09 02:23:00', '2026-07-09 02:23:00', NULL),
(291, 72, 291, NULL, NULL, 'INIT-291', 'initial', 26, 26, 'available', NULL, NULL, 'Stok awal koleksi Sandal Kulit Tali Silang Cokelat', '2026-07-09 02:23:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-09 02:23:00', '2026-07-09 02:23:00', NULL),
(292, 72, 292, NULL, NULL, 'INIT-292', 'initial', 37, 37, 'available', NULL, NULL, 'Stok awal koleksi Sandal Kulit Tali Silang Cokelat', '2026-07-09 02:23:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-09 02:23:00', '2026-07-09 02:23:00', NULL),
(293, 73, 293, NULL, NULL, 'INIT-293', 'initial', 30, 30, 'available', NULL, NULL, 'Stok awal koleksi Sandal Sport Outdoor Abu', '2026-07-07 03:36:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-07 03:36:00', '2026-07-07 03:36:00', NULL),
(294, 73, 294, NULL, NULL, 'INIT-294', 'initial', 41, 41, 'available', NULL, NULL, 'Stok awal koleksi Sandal Sport Outdoor Abu', '2026-07-07 03:36:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-07 03:36:00', '2026-07-07 03:36:00', NULL),
(295, 73, 295, NULL, NULL, 'INIT-295', 'initial', 10, 10, 'available', NULL, NULL, 'Stok awal koleksi Sandal Sport Outdoor Abu', '2026-07-07 03:36:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-07 03:36:00', '2026-07-07 03:36:00', NULL),
(296, 73, 296, NULL, NULL, 'INIT-296', 'initial', 21, 21, 'available', NULL, NULL, 'Stok awal koleksi Sandal Sport Outdoor Abu', '2026-07-07 03:36:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-07 03:36:00', '2026-07-07 03:36:00', NULL),
(297, 73, 297, NULL, NULL, 'INIT-297', 'initial', 32, 32, 'available', NULL, NULL, 'Stok awal koleksi Sandal Sport Outdoor Abu', '2026-07-07 03:36:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-07 03:36:00', '2026-07-07 03:36:00', NULL),
(298, 74, 298, NULL, NULL, 'INIT-298', 'initial', 25, 25, 'available', NULL, NULL, 'Stok awal koleksi Sandal Heels Tali Mocca', '2026-07-05 04:49:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-05 04:49:00', '2026-07-05 04:49:00', NULL),
(299, 74, 299, NULL, NULL, 'INIT-299', 'initial', 36, 36, 'available', NULL, NULL, 'Stok awal koleksi Sandal Heels Tali Mocca', '2026-07-05 04:49:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-05 04:49:00', '2026-07-05 04:49:00', NULL),
(300, 74, 300, NULL, NULL, 'INIT-300', 'initial', 47, 47, 'available', NULL, NULL, 'Stok awal koleksi Sandal Heels Tali Mocca', '2026-07-05 04:49:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-05 04:49:00', '2026-07-05 04:49:00', NULL),
(301, 74, 301, NULL, NULL, 'INIT-301', 'initial', 16, 16, 'available', NULL, NULL, 'Stok awal koleksi Sandal Heels Tali Mocca', '2026-07-05 04:49:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-05 04:49:00', '2026-07-05 04:49:00', NULL),
(302, 74, 302, NULL, NULL, 'INIT-302', 'initial', 27, 27, 'available', NULL, NULL, 'Stok awal koleksi Sandal Heels Tali Mocca', '2026-07-05 04:49:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-05 04:49:00', '2026-07-05 04:49:00', NULL),
(303, 75, 303, NULL, NULL, 'INIT-303', 'initial', 20, 20, 'available', NULL, NULL, 'Stok awal koleksi Tas Ransel Kanvas Vintage Khaki', '2026-07-03 05:02:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-03 05:02:00', '2026-07-03 05:02:00', NULL),
(304, 76, 304, NULL, NULL, 'INIT-304', 'initial', 15, 15, 'available', NULL, NULL, 'Stok awal koleksi Ransel Laptop Water Repellent Hitam', '2026-07-01 06:15:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-07-01 06:15:00', '2026-07-01 06:15:00', NULL),
(305, 77, 305, NULL, NULL, 'INIT-305', 'initial', 10, 10, 'available', NULL, NULL, 'Stok awal koleksi Ransel Roll Top Army', '2026-06-29 07:28:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-06-29 07:28:00', '2026-06-29 07:28:00', NULL),
(306, 78, 306, NULL, NULL, 'INIT-306', 'initial', 47, 47, 'available', NULL, NULL, 'Stok awal koleksi Ransel Mini Nylon Cream', '2026-06-27 08:41:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-06-27 08:41:00', '2026-06-27 08:41:00', NULL),
(307, 79, 307, NULL, NULL, 'INIT-307', 'initial', 42, 42, 'available', NULL, NULL, 'Stok awal koleksi Ransel Kulit Cokelat', '2026-06-25 09:54:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-06-25 09:54:00', '2026-06-25 09:54:00', NULL),
(308, 80, 308, NULL, NULL, 'INIT-308', 'initial', 37, 37, 'available', NULL, NULL, 'Stok awal koleksi Tas Selempang Kanvas Natural', '2026-06-23 10:07:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-06-23 10:07:00', '2026-06-23 10:07:00', NULL),
(309, 81, 309, NULL, NULL, 'INIT-309', 'initial', 32, 32, 'available', NULL, NULL, 'Stok awal koleksi Sling Cordura Hitam', '2026-06-21 01:20:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-06-21 01:20:00', '2026-06-21 01:20:00', NULL),
(310, 82, 310, NULL, NULL, 'INIT-310', 'initial', 27, 27, 'available', NULL, NULL, 'Stok awal koleksi Tas Selempang Kulit Cokelat', '2026-06-19 02:33:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-06-19 02:33:00', '2026-06-19 02:33:00', NULL),
(311, 83, 311, NULL, NULL, 'INIT-311', 'initial', 22, 22, 'available', NULL, NULL, 'Stok awal koleksi Sling Ripstop Olive', '2026-06-17 03:46:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-06-17 03:46:00', '2026-06-17 03:46:00', NULL),
(312, 84, 312, NULL, NULL, 'INIT-312', 'initial', 17, 17, 'available', NULL, NULL, 'Stok awal koleksi Selempang Mini Quilted Cream', '2026-06-15 04:59:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-06-15 04:59:00', '2026-06-15 04:59:00', NULL),
(313, 85, 313, NULL, NULL, 'INIT-313', 'initial', 12, 12, 'available', NULL, NULL, 'Stok awal koleksi Messenger Kanvas Navy', '2026-06-13 05:12:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-06-13 05:12:00', '2026-06-13 05:12:00', NULL),
(314, 86, 314, NULL, NULL, 'INIT-314', 'initial', 7, 7, 'available', NULL, NULL, 'Stok awal koleksi Dompet Kulit Lipat Hitam', '2026-06-11 06:25:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-06-11 06:25:00', '2026-06-11 06:25:00', NULL),
(315, 87, 315, NULL, NULL, 'INIT-315', 'initial', 44, 44, 'available', NULL, NULL, 'Stok awal koleksi Dompet Kulit Panjang Cokelat', '2026-06-09 07:38:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-06-09 07:38:00', '2026-06-09 07:38:00', NULL),
(316, 88, 316, NULL, NULL, 'INIT-316', 'initial', 39, 39, 'available', NULL, NULL, 'Stok awal koleksi Dompet Kartu Slim Navy', '2026-06-07 08:51:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-06-07 08:51:00', '2026-06-07 08:51:00', NULL),
(317, 89, 317, NULL, NULL, 'INIT-317', 'initial', 34, 34, 'available', NULL, NULL, 'Stok awal koleksi Dompet Kanvas Olive', '2026-06-05 09:04:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-06-05 09:04:00', '2026-06-05 09:04:00', NULL),
(318, 90, 318, NULL, NULL, 'INIT-318', 'initial', 29, 29, 'available', NULL, NULL, 'Stok awal koleksi Jam Tangan Minimalis Dial Putih', '2026-06-03 10:17:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-06-03 10:17:00', '2026-06-03 10:17:00', NULL),
(319, 91, 319, NULL, NULL, 'INIT-319', 'initial', 24, 24, 'available', NULL, NULL, 'Stok awal koleksi Jam Tangan Kulit Cokelat 38mm', '2026-06-01 01:30:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-06-01 01:30:00', '2026-06-01 01:30:00', NULL),
(320, 92, 320, NULL, NULL, 'INIT-320', 'initial', 19, 19, 'available', NULL, NULL, 'Stok awal koleksi Jam Tangan Digital Sport Hitam', '2026-05-30 02:43:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-05-30 02:43:00', '2026-05-30 02:43:00', NULL),
(321, 93, 321, NULL, NULL, 'INIT-321', 'initial', 14, 14, 'available', NULL, NULL, 'Stok awal koleksi Jam Tangan Mesh Steel Silver', '2026-05-28 03:56:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-05-28 03:56:00', '2026-05-28 03:56:00', NULL),
(322, 94, 322, NULL, NULL, 'INIT-322', 'initial', 9, 9, 'available', NULL, NULL, 'Stok awal koleksi Jam Tangan Couple Set Rose Gold', '2026-05-26 04:09:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-05-26 04:09:00', '2026-05-26 04:09:00', NULL),
(323, 95, 323, NULL, NULL, 'INIT-323', 'initial', 46, 46, 'available', NULL, NULL, 'Stok awal koleksi Kacamata Wayfarer Hitam', '2026-05-24 05:22:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-05-24 05:22:00', '2026-05-24 05:22:00', NULL),
(324, 96, 324, NULL, NULL, 'INIT-324', 'initial', 41, 41, 'available', NULL, NULL, 'Stok awal koleksi Kacamata Bulat Frame Emas', '2026-05-22 06:35:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-05-22 06:35:00', '2026-05-22 06:35:00', NULL),
(325, 97, 325, NULL, NULL, 'INIT-325', 'initial', 36, 36, 'available', NULL, NULL, 'Stok awal koleksi Kacamata Cat Eye Tortoise', '2026-05-20 07:48:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-05-20 07:48:00', '2026-05-20 07:48:00', NULL),
(326, 98, 326, NULL, NULL, 'INIT-326', 'initial', 31, 31, 'available', NULL, NULL, 'Stok awal koleksi Kalung Rantai Stainless Gold', '2026-05-18 08:01:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-05-18 08:01:00', '2026-05-18 08:01:00', NULL),
(327, 99, 327, NULL, NULL, 'INIT-327', 'initial', 26, 26, 'available', NULL, NULL, 'Stok awal koleksi Gelang Beads Natural Stone', '2026-05-16 09:14:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-05-16 09:14:00', '2026-05-16 09:14:00', NULL),
(328, 100, 328, NULL, NULL, 'INIT-328', 'initial', 21, 21, 'available', NULL, NULL, 'Stok awal koleksi Anting Hoop Stainless Silver', '2026-05-14 10:27:00', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-05-14 10:27:00', '2026-05-14 10:27:00', NULL),
(329, 1, 1, 1, 1, 'seed-outbound.1', 'outbound', -2, 10, 'available', 'order_status', '1', 'Pengurangan stok pesanan FKU-20261114-9000', '2026-11-14 02:40:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-14 02:40:02', '2026-11-14 02:24:02', NULL),
(330, 2, 6, 18, 36, 'seed-outbound.36', 'outbound', -1, 6, 'available', 'order_status', '18', 'Pengurangan stok pesanan FKU-20261114-9017', '2026-11-13 19:49:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 19:49:02', '2026-11-14 02:24:02', NULL),
(331, 4, 14, 25, 49, 'seed-outbound.49', 'outbound', -2, 37, 'available', 'order_status', '25', 'Pengurangan stok pesanan FKU-20261113-9024', '2026-11-13 10:44:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 10:44:02', '2026-11-14 02:24:02', NULL),
(332, 4, 14, 2, 2, 'seed-outbound.2', 'outbound', -1, 36, 'available', 'order_status', '2', 'Pengurangan stok pesanan FKU-20261114-9001', '2026-11-14 02:33:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-14 02:33:02', '2026-11-14 02:24:02', NULL),
(333, 5, 18, 26, 50, 'seed-outbound.50', 'outbound', -1, 33, 'available', 'order_status', '26', 'Pengurangan stok pesanan FKU-20261113-9025', '2026-11-13 08:44:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 08:44:02', '2026-11-14 02:24:02', NULL),
(334, 6, 22, 23, 45, 'seed-outbound.45', 'outbound', -1, 28, 'available', 'order_status', '23', 'Pengurangan stok pesanan FKU-20261113-9022', '2026-11-13 13:44:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 13:44:02', '2026-11-14 02:24:02', NULL),
(335, 7, 27, 27, 52, 'seed-outbound.52', 'outbound', -1, 45, 'available', 'order_status', '27', 'Pengurangan stok pesanan FKU-20261113-9026', '2026-11-13 06:44:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 06:44:02', '2026-11-14 02:24:02', NULL),
(336, 7, 27, 3, 4, 'seed-outbound.4', 'outbound', -1, 44, 'available', 'order_status', '3', 'Pengurangan stok pesanan FKU-20261114-9002', '2026-11-14 02:25:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-14 02:25:02', '2026-11-14 02:24:02', NULL),
(337, 10, 35, 51, 100, 'seed-outbound.100', 'outbound', -1, 8, 'available', 'order_status', '51', 'Pengurangan stok pesanan FKU-20261111-9050', '2026-11-11 00:30:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-11 00:30:02', '2026-11-14 02:24:02', NULL),
(338, 10, 35, 50, 98, 'seed-outbound.98', 'outbound', -1, 7, 'available', 'order_status', '50', 'Pengurangan stok pesanan FKU-20261111-9049', '2026-11-11 02:47:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-11 02:47:02', '2026-11-14 02:24:02', NULL),
(339, 10, 35, 49, 97, 'seed-outbound.97', 'outbound', -2, 5, 'available', 'order_status', '49', 'Pengurangan stok pesanan FKU-20261111-9048', '2026-11-11 05:04:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-11 05:04:02', '2026-11-14 02:24:02', NULL),
(340, 10, 35, 48, 95, 'seed-outbound.95', 'outbound', -2, 3, 'available', 'order_status', '48', 'Pengurangan stok pesanan FKU-20261111-9047', '2026-11-11 07:21:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-11 07:21:02', '2026-11-14 02:24:02', NULL),
(341, 10, 35, 47, 93, 'seed-outbound.93', 'outbound', -1, 2, 'available', 'order_status', '47', 'Pengurangan stok pesanan FKU-20261111-9046', '2026-11-11 09:38:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-11 09:38:02', '2026-11-14 02:24:02', NULL),
(342, 10, 35, 42, 84, 'seed-outbound.84', 'outbound', -1, 1, 'available', 'order_status', '42', 'Pengurangan stok pesanan FKU-20261112-9041', '2026-11-11 21:03:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-11 21:03:02', '2026-11-14 02:24:02', NULL),
(343, 10, 35, 24, 47, 'seed-outbound.47', 'outbound', -2, 0, 'available', 'order_status', '24', 'Pengurangan stok pesanan FKU-20261113-9023', '2026-11-13 12:14:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 12:14:02', '2026-11-14 02:24:02', NULL),
(344, 11, 40, 52, 103, 'seed-outbound.103', 'outbound', -2, 24, 'available', 'order_status', '52', 'Pengurangan stok pesanan FKU-20261111-9051', '2026-11-10 22:13:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-10 22:13:02', '2026-11-14 02:24:02', NULL),
(345, 11, 40, 28, 55, 'seed-outbound.55', 'outbound', -2, 22, 'available', 'order_status', '28', 'Pengurangan stok pesanan FKU-20261113-9027', '2026-11-13 04:44:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 04:44:02', '2026-11-14 02:24:02', NULL),
(346, 12, 42, 66, 132, 'seed-outbound.132', 'outbound', -1, 40, 'available', 'order_status', '66', 'Pengurangan stok pesanan FKU-20261107-9065', '2026-11-07 03:01:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-07 03:01:02', '2026-11-14 02:24:02', NULL),
(347, 12, 43, 69, 138, 'seed-outbound.138', 'outbound', -1, 9, 'available', 'order_status', '69', 'Pengurangan stok pesanan FKU-20261106-9068', '2026-11-06 10:28:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-06 10:28:02', '2026-11-14 02:24:02', NULL),
(348, 12, 43, 45, 90, 'seed-outbound.90', 'outbound', -1, 8, 'available', 'order_status', '45', 'Pengurangan stok pesanan FKU-20261111-9044', '2026-11-11 14:12:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-11 14:12:02', '2026-11-14 02:24:02', NULL),
(349, 12, 43, 21, 42, 'seed-outbound.42', 'outbound', -1, 7, 'available', 'order_status', '21', 'Pengurangan stok pesanan FKU-20261113-9020', '2026-11-13 16:34:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 16:34:02', '2026-11-14 02:24:02', NULL),
(350, 13, 46, 76, 151, 'seed-outbound.151', 'outbound', -2, 34, 'available', 'order_status', '76', 'Pengurangan stok pesanan FKU-20261105-9075', '2026-11-04 19:51:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-04 19:51:02', '2026-11-14 02:24:02', NULL),
(351, 13, 46, 75, 148, 'seed-outbound.148', 'outbound', -1, 33, 'available', 'order_status', '75', 'Pengurangan stok pesanan FKU-20261105-9074', '2026-11-05 01:22:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-05 01:22:02', '2026-11-14 02:24:02', NULL),
(352, 13, 46, 74, 146, 'seed-outbound.146', 'outbound', -1, 32, 'available', 'order_status', '74', 'Pengurangan stok pesanan FKU-20261105-9073', '2026-11-05 06:53:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-05 06:53:02', '2026-11-14 02:24:02', NULL),
(353, 13, 46, 73, 145, 'seed-outbound.145', 'outbound', -2, 30, 'available', 'order_status', '73', 'Pengurangan stok pesanan FKU-20261105-9072', '2026-11-05 12:24:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-05 12:24:02', '2026-11-14 02:24:02', NULL),
(354, 13, 46, 72, 143, 'seed-outbound.143', 'outbound', -2, 28, 'available', 'order_status', '72', 'Pengurangan stok pesanan FKU-20261106-9071', '2026-11-05 17:55:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-05 17:55:02', '2026-11-14 02:24:02', NULL),
(355, 13, 46, 71, 141, 'seed-outbound.141', 'outbound', -1, 27, 'available', 'order_status', '71', 'Pengurangan stok pesanan FKU-20261106-9070', '2026-11-05 23:26:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-05 23:26:02', '2026-11-14 02:24:02', NULL),
(356, 15, 53, 77, 152, 'seed-outbound.152', 'outbound', -1, 25, 'available', 'order_status', '77', 'Pengurangan stok pesanan FKU-20261104-9076', '2026-11-04 14:20:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-04 14:20:02', '2026-11-14 02:24:02', NULL),
(357, 15, 53, 53, 104, 'seed-outbound.104', 'outbound', -1, 24, 'available', 'order_status', '53', 'Pengurangan stok pesanan FKU-20261110-9052', '2026-11-10 02:44:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-10 02:44:02', '2026-11-14 02:24:02', NULL),
(358, 15, 53, 29, 56, 'seed-outbound.56', 'outbound', -1, 23, 'available', 'order_status', '29', 'Pengurangan stok pesanan FKU-20261113-9028', '2026-11-13 02:44:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 02:44:02', '2026-11-14 02:24:02', NULL),
(359, 15, 53, 5, 8, 'seed-outbound.8', 'outbound', -1, 22, 'available', 'order_status', '5', 'Pengurangan stok pesanan FKU-20261114-9004', '2026-11-14 02:06:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-14 02:06:02', '2026-11-14 02:24:02', NULL),
(360, 17, 61, 74, 147, 'seed-outbound.147', 'outbound', -1, 26, 'available', 'order_status', '74', 'Pengurangan stok pesanan FKU-20261105-9073', '2026-11-05 06:53:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-05 06:53:02', '2026-11-14 02:24:02', NULL),
(361, 17, 61, 50, 99, 'seed-outbound.99', 'outbound', -1, 25, 'available', 'order_status', '50', 'Pengurangan stok pesanan FKU-20261111-9049', '2026-11-11 02:47:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-11 02:47:02', '2026-11-14 02:24:02', NULL),
(362, 17, 61, 26, 51, 'seed-outbound.51', 'outbound', -1, 24, 'available', 'order_status', '26', 'Pengurangan stok pesanan FKU-20261113-9025', '2026-11-13 08:44:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 08:44:02', '2026-11-14 02:24:02', NULL),
(363, 17, 61, 2, 3, 'seed-outbound.3', 'outbound', -1, 23, 'available', 'order_status', '2', 'Pengurangan stok pesanan FKU-20261114-9001', '2026-11-14 02:33:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-14 02:33:02', '2026-11-14 02:24:02', NULL),
(364, 19, 66, 90, 180, 'seed-outbound.180', 'outbound', -1, 5, 'available', 'order_status', '90', 'Pengurangan stok pesanan FKU-20261024-9089', '2026-10-24 15:49:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-24 15:49:02', '2026-11-14 02:24:02', NULL),
(365, 19, 66, 78, 154, 'seed-outbound.154', 'outbound', -1, 4, 'available', 'order_status', '78', 'Pengurangan stok pesanan FKU-20261104-9077', '2026-11-04 08:49:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-04 08:49:02', '2026-11-14 02:24:02', NULL),
(366, 19, 66, 54, 106, 'seed-outbound.106', 'outbound', -1, 3, 'available', 'order_status', '54', 'Pengurangan stok pesanan FKU-20261110-9053', '2026-11-09 21:13:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-09 21:13:02', '2026-11-14 02:24:02', NULL),
(367, 19, 66, 30, 58, 'seed-outbound.58', 'outbound', -1, 2, 'available', 'order_status', '30', 'Pengurangan stok pesanan FKU-20261113-9029', '2026-11-13 00:27:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 00:27:02', '2026-11-14 02:24:02', NULL),
(368, 19, 66, 6, 10, 'seed-outbound.10', 'outbound', -1, 1, 'available', 'order_status', '6', 'Pengurangan stok pesanan FKU-20261114-9005', '2026-11-14 01:52:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-14 01:52:02', '2026-11-14 02:24:02', NULL),
(369, 21, 73, 95, 189, 'seed-outbound.189', 'outbound', -1, 37, 'available', 'order_status', '95', 'Pengurangan stok pesanan FKU-20261019-9094', '2026-10-19 04:54:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-19 04:54:02', '2026-11-14 02:24:02', NULL),
(370, 21, 73, 93, 186, 'seed-outbound.186', 'outbound', -1, 36, 'available', 'order_status', '93', 'Pengurangan stok pesanan FKU-20261021-9092', '2026-10-21 09:16:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-21 09:16:02', '2026-11-14 02:24:02', NULL),
(371, 21, 74, 75, 149, 'seed-outbound.149', 'outbound', -2, 5, 'available', 'order_status', '75', 'Pengurangan stok pesanan FKU-20261105-9074', '2026-11-05 01:22:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-05 01:22:02', '2026-11-14 02:24:02', NULL),
(372, 21, 74, 51, 101, 'seed-outbound.101', 'outbound', -2, 3, 'available', 'order_status', '51', 'Pengurangan stok pesanan FKU-20261111-9050', '2026-11-11 00:30:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-11 00:30:02', '2026-11-14 02:24:02', NULL),
(373, 21, 74, 27, 53, 'seed-outbound.53', 'outbound', -2, 1, 'available', 'order_status', '27', 'Pengurangan stok pesanan FKU-20261113-9026', '2026-11-13 06:44:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 06:44:02', '2026-11-14 02:24:02', NULL),
(374, 21, 74, 3, 5, 'seed-outbound.5', 'outbound', -2, 0, 'available', 'order_status', '3', 'Pengurangan stok pesanan FKU-20261114-9002', '2026-11-14 02:25:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-14 02:25:02', '2026-11-14 02:24:02', NULL),
(375, 22, 77, 96, 191, 'seed-outbound.191', 'outbound', -2, 31, 'available', 'order_status', '96', 'Pengurangan stok pesanan FKU-20261018-9095', '2026-10-18 02:43:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-18 02:43:02', '2026-11-14 02:24:02', NULL),
(376, 22, 79, 79, 157, 'seed-outbound.157', 'outbound', -2, 11, 'available', 'order_status', '79', 'Pengurangan stok pesanan FKU-20261104-9078', '2026-11-04 03:18:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-04 03:18:02', '2026-11-14 02:24:02', NULL),
(377, 22, 79, 31, 61, 'seed-outbound.61', 'outbound', -2, 9, 'available', 'order_status', '31', 'Pengurangan stok pesanan FKU-20261113-9030', '2026-11-12 22:10:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-12 22:10:02', '2026-11-14 02:24:02', NULL),
(378, 22, 79, 7, 13, 'seed-outbound.13', 'outbound', -2, 7, 'available', 'order_status', '7', 'Pengurangan stok pesanan FKU-20261114-9006', '2026-11-14 01:38:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-14 01:38:02', '2026-11-14 02:24:02', NULL),
(379, 23, 80, 98, 194, 'seed-outbound.194', 'outbound', -1, 27, 'available', 'order_status', '98', 'Pengurangan stok pesanan FKU-20261016-9097', '2026-10-15 22:21:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-15 22:21:02', '2026-11-14 02:24:02', NULL),
(380, 23, 80, 98, 195, 'seed-outbound.195', 'outbound', -1, 26, 'available', 'order_status', '98', 'Pengurangan stok pesanan FKU-20261016-9097', '2026-10-15 22:21:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-15 22:21:02', '2026-11-14 02:24:02', NULL),
(381, 23, 80, 97, 193, 'seed-outbound.193', 'outbound', -2, 24, 'available', 'order_status', '97', 'Pengurangan stok pesanan FKU-20261017-9096', '2026-10-17 00:32:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-17 00:32:02', '2026-11-14 02:24:02', NULL),
(382, 23, 82, 96, 192, 'seed-outbound.192', 'outbound', -1, 7, 'available', 'order_status', '96', 'Pengurangan stok pesanan FKU-20261018-9095', '2026-10-18 02:43:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-18 02:43:02', '2026-11-14 02:24:02', NULL),
(383, 23, 82, 72, 144, 'seed-outbound.144', 'outbound', -1, 6, 'available', 'order_status', '72', 'Pengurangan stok pesanan FKU-20261106-9071', '2026-11-05 17:55:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-05 17:55:02', '2026-11-14 02:24:02', NULL),
(384, 23, 82, 48, 96, 'seed-outbound.96', 'outbound', -1, 5, 'available', 'order_status', '48', 'Pengurangan stok pesanan FKU-20261111-9047', '2026-11-11 07:21:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-11 07:21:02', '2026-11-14 02:24:02', NULL),
(385, 23, 82, 24, 48, 'seed-outbound.48', 'outbound', -1, 4, 'available', 'order_status', '24', 'Pengurangan stok pesanan FKU-20261113-9023', '2026-11-13 12:14:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 12:14:02', '2026-11-14 02:24:02', NULL),
(386, 24, 83, 100, 199, 'seed-outbound.199', 'outbound', -2, 21, 'available', 'order_status', '100', 'Pengurangan stok pesanan FKU-20261014-9099', '2026-10-13 17:59:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-13 17:59:02', '2026-11-14 02:24:02', NULL),
(387, 24, 83, 99, 196, 'seed-outbound.196', 'outbound', -1, 20, 'available', 'order_status', '99', 'Pengurangan stok pesanan FKU-20261015-9098', '2026-10-14 20:10:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-14 20:10:02', '2026-11-14 02:24:02', NULL),
(388, 24, 83, 99, 197, 'seed-outbound.197', 'outbound', -2, 18, 'available', 'order_status', '99', 'Pengurangan stok pesanan FKU-20261015-9098', '2026-10-14 20:10:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-14 20:10:02', '2026-11-14 02:24:02', NULL),
(389, 25, 87, 102, 202, 'seed-outbound.202', 'outbound', -1, 17, 'available', 'order_status', '102', 'Pengurangan stok pesanan FKU-20261011-9101', '2026-10-11 13:37:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-11 13:37:02', '2026-11-14 02:24:02', NULL),
(390, 25, 87, 101, 200, 'seed-outbound.200', 'outbound', -1, 16, 'available', 'order_status', '101', 'Pengurangan stok pesanan FKU-20261012-9100', '2026-10-12 15:48:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-12 15:48:02', '2026-11-14 02:24:02', NULL),
(391, 25, 92, 80, 158, 'seed-outbound.158', 'outbound', -1, 30, 'available', 'order_status', '80', 'Pengurangan stok pesanan FKU-20261104-9079', '2026-11-03 21:47:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-03 21:47:02', '2026-11-14 02:24:02', NULL),
(392, 25, 92, 56, 110, 'seed-outbound.110', 'outbound', -1, 29, 'available', 'order_status', '56', 'Pengurangan stok pesanan FKU-20261109-9055', '2026-11-09 10:11:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-09 10:11:02', '2026-11-14 02:24:02', NULL),
(393, 25, 92, 32, 62, 'seed-outbound.62', 'outbound', -1, 28, 'available', 'order_status', '32', 'Pengurangan stok pesanan FKU-20261113-9031', '2026-11-12 19:53:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-12 19:53:02', '2026-11-14 02:24:02', NULL);
INSERT INTO `stock_movements` (`id`, `product_id`, `variant_id`, `order_id`, `order_item_id`, `movement_key`, `type`, `quantity_delta`, `balance_after`, `stock_dimension`, `reference_type`, `reference_id`, `notes`, `occurred_at`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(394, 25, 92, 8, 14, 'seed-outbound.14', 'outbound', -1, 27, 'available', 'order_status', '8', 'Pengurangan stok pesanan FKU-20261114-9007', '2026-11-14 01:21:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-14 01:21:02', '2026-11-14 02:24:02', NULL),
(395, 26, 93, 104, 206, 'seed-outbound.206', 'outbound', -1, 12, 'available', 'order_status', '104', 'Pengurangan stok pesanan FKU-20261009-9103', '2026-10-09 09:15:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-09 09:15:02', '2026-11-14 02:24:02', NULL),
(396, 26, 93, 103, 205, 'seed-outbound.205', 'outbound', -2, 10, 'available', 'order_status', '103', 'Pengurangan stok pesanan FKU-20261010-9102', '2026-10-10 11:26:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-10 11:26:02', '2026-11-14 02:24:02', NULL),
(397, 27, 100, 101, 201, 'seed-outbound.201', 'outbound', -1, 18, 'available', 'order_status', '101', 'Pengurangan stok pesanan FKU-20261012-9100', '2026-10-12 15:48:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-12 15:48:02', '2026-11-14 02:24:02', NULL),
(398, 27, 100, 77, 153, 'seed-outbound.153', 'outbound', -1, 17, 'available', 'order_status', '77', 'Pengurangan stok pesanan FKU-20261104-9076', '2026-11-04 14:20:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-04 14:20:02', '2026-11-14 02:24:02', NULL),
(399, 27, 100, 53, 105, 'seed-outbound.105', 'outbound', -1, 16, 'available', 'order_status', '53', 'Pengurangan stok pesanan FKU-20261110-9052', '2026-11-10 02:44:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-10 02:44:02', '2026-11-14 02:24:02', NULL),
(400, 27, 100, 29, 57, 'seed-outbound.57', 'outbound', -1, 15, 'available', 'order_status', '29', 'Pengurangan stok pesanan FKU-20261113-9028', '2026-11-13 02:44:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 02:44:02', '2026-11-14 02:24:02', NULL),
(401, 27, 100, 5, 9, 'seed-outbound.9', 'outbound', -1, 14, 'available', 'order_status', '5', 'Pengurangan stok pesanan FKU-20261114-9004', '2026-11-14 02:06:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-14 02:06:02', '2026-11-14 02:24:02', NULL),
(402, 28, 105, 105, 208, 'seed-outbound.208', 'outbound', -1, 13, 'available', 'order_status', '105', 'Pengurangan stok pesanan FKU-20261008-9104', '2026-10-08 07:04:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-08 07:04:02', '2026-11-14 02:24:02', NULL),
(403, 28, 105, 81, 160, 'seed-outbound.160', 'outbound', -1, 12, 'available', 'order_status', '81', 'Pengurangan stok pesanan FKU-20261103-9080', '2026-11-03 16:16:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-03 16:16:02', '2026-11-14 02:24:02', NULL),
(404, 28, 105, 57, 112, 'seed-outbound.112', 'outbound', -1, 11, 'available', 'order_status', '57', 'Pengurangan stok pesanan FKU-20261109-9056', '2026-11-09 04:40:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-09 04:40:02', '2026-11-14 02:24:02', NULL),
(405, 28, 105, 33, 64, 'seed-outbound.64', 'outbound', -1, 10, 'available', 'order_status', '33', 'Pengurangan stok pesanan FKU-20261113-9032', '2026-11-12 17:36:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-12 17:36:02', '2026-11-14 02:24:02', NULL),
(406, 28, 105, 9, 16, 'seed-outbound.16', 'outbound', -1, 9, 'available', 'order_status', '9', 'Pengurangan stok pesanan FKU-20261114-9008', '2026-11-14 01:07:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-14 01:07:02', '2026-11-14 02:24:02', NULL),
(407, 30, 116, 102, 203, 'seed-outbound.203', 'outbound', -2, 35, 'available', 'order_status', '102', 'Pengurangan stok pesanan FKU-20261011-9101', '2026-10-11 13:37:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-11 13:37:02', '2026-11-14 02:24:02', NULL),
(408, 30, 116, 78, 155, 'seed-outbound.155', 'outbound', -2, 33, 'available', 'order_status', '78', 'Pengurangan stok pesanan FKU-20261104-9077', '2026-11-04 08:49:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-04 08:49:02', '2026-11-14 02:24:02', NULL),
(409, 30, 116, 54, 107, 'seed-outbound.107', 'outbound', -2, 31, 'available', 'order_status', '54', 'Pengurangan stok pesanan FKU-20261110-9053', '2026-11-09 21:13:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-09 21:13:02', '2026-11-14 02:24:02', NULL),
(410, 30, 116, 30, 59, 'seed-outbound.59', 'outbound', -2, 29, 'available', 'order_status', '30', 'Pengurangan stok pesanan FKU-20261113-9029', '2026-11-13 00:27:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 00:27:02', '2026-11-14 02:24:02', NULL),
(411, 30, 116, 6, 11, 'seed-outbound.11', 'outbound', -2, 27, 'available', 'order_status', '6', 'Pengurangan stok pesanan FKU-20261114-9005', '2026-11-14 01:52:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-14 01:52:02', '2026-11-14 02:24:02', NULL),
(412, 31, 121, 106, 211, 'seed-outbound.211', 'outbound', -2, 30, 'available', 'order_status', '106', 'Pengurangan stok pesanan FKU-20261007-9105', '2026-10-07 04:53:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-07 04:53:02', '2026-11-14 02:24:02', NULL),
(413, 31, 121, 58, 115, 'seed-outbound.115', 'outbound', -2, 28, 'available', 'order_status', '58', 'Pengurangan stok pesanan FKU-20261109-9057', '2026-11-08 23:09:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-08 23:09:02', '2026-11-14 02:24:02', NULL),
(414, 31, 121, 34, 67, 'seed-outbound.67', 'outbound', -2, 26, 'available', 'order_status', '34', 'Pengurangan stok pesanan FKU-20261112-9033', '2026-11-12 15:19:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-12 15:19:02', '2026-11-14 02:24:02', NULL),
(415, 31, 121, 10, 19, 'seed-outbound.19', 'outbound', -2, 24, 'available', 'order_status', '10', 'Pengurangan stok pesanan FKU-20261114-9009', '2026-11-14 00:49:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-14 00:49:02', '2026-11-14 02:24:02', NULL),
(416, 32, 123, 114, 228, 'seed-outbound.228', 'outbound', -1, 24, 'available', 'order_status', '114', 'Pengurangan stok pesanan FKU-20260928-9113', '2026-09-28 11:25:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-28 11:25:02', '2026-11-14 02:24:02', NULL),
(417, 32, 124, 99, 198, 'seed-outbound.198', 'outbound', -1, 35, 'available', 'order_status', '99', 'Pengurangan stok pesanan FKU-20261015-9098', '2026-10-14 20:10:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-14 20:10:02', '2026-11-14 02:24:02', NULL),
(418, 32, 124, 75, 150, 'seed-outbound.150', 'outbound', -1, 34, 'available', 'order_status', '75', 'Pengurangan stok pesanan FKU-20261105-9074', '2026-11-05 01:22:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-05 01:22:02', '2026-11-14 02:24:02', NULL),
(419, 32, 124, 51, 102, 'seed-outbound.102', 'outbound', -1, 33, 'available', 'order_status', '51', 'Pengurangan stok pesanan FKU-20261111-9050', '2026-11-11 00:30:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-11 00:30:02', '2026-11-14 02:24:02', NULL),
(420, 32, 124, 27, 54, 'seed-outbound.54', 'outbound', -1, 32, 'available', 'order_status', '27', 'Pengurangan stok pesanan FKU-20261113-9026', '2026-11-13 06:44:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 06:44:02', '2026-11-14 02:24:02', NULL),
(421, 32, 124, 3, 6, 'seed-outbound.6', 'outbound', -1, 31, 'available', 'order_status', '3', 'Pengurangan stok pesanan FKU-20261114-9002', '2026-11-14 02:25:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-14 02:25:02', '2026-11-14 02:24:02', NULL),
(422, 33, 127, 117, 234, 'seed-outbound.234', 'outbound', -1, 19, 'available', 'order_status', '117', 'Pengurangan stok pesanan FKU-20260925-9116', '2026-09-25 04:52:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-25 04:52:02', '2026-11-14 02:24:02', NULL),
(423, 35, 134, 120, 239, 'seed-outbound.239', 'outbound', -2, 8, 'available', 'order_status', '120', 'Pengurangan stok pesanan FKU-20260922-9119', '2026-09-21 22:19:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-21 22:19:02', '2026-11-14 02:24:02', NULL),
(424, 35, 134, 120, 240, 'seed-outbound.240', 'outbound', -1, 7, 'available', 'order_status', '120', 'Pengurangan stok pesanan FKU-20260922-9119', '2026-09-21 22:19:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-21 22:19:02', '2026-11-14 02:24:02', NULL),
(425, 35, 134, 119, 237, 'seed-outbound.237', 'outbound', -1, 6, 'available', 'order_status', '119', 'Pengurangan stok pesanan FKU-20260923-9118', '2026-09-23 00:30:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-23 00:30:02', '2026-11-14 02:24:02', NULL),
(426, 35, 134, 107, 212, 'seed-outbound.212', 'outbound', -1, 5, 'available', 'order_status', '107', 'Pengurangan stok pesanan FKU-20261006-9106', '2026-10-06 02:42:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-06 02:42:02', '2026-11-14 02:24:02', NULL),
(427, 35, 134, 83, 164, 'seed-outbound.164', 'outbound', -1, 4, 'available', 'order_status', '83', 'Pengurangan stok pesanan FKU-20261103-9082', '2026-11-03 05:14:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-03 05:14:02', '2026-11-14 02:24:02', NULL),
(428, 35, 134, 59, 116, 'seed-outbound.116', 'outbound', -1, 3, 'available', 'order_status', '59', 'Pengurangan stok pesanan FKU-20261109-9058', '2026-11-08 17:38:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-08 17:38:02', '2026-11-14 02:24:02', NULL),
(429, 35, 134, 35, 68, 'seed-outbound.68', 'outbound', -1, 2, 'available', 'order_status', '35', 'Pengurangan stok pesanan FKU-20261112-9034', '2026-11-12 13:02:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-12 13:02:02', '2026-11-14 02:24:02', NULL),
(430, 35, 134, 11, 20, 'seed-outbound.20', 'outbound', -1, 1, 'available', 'order_status', '11', 'Pengurangan stok pesanan FKU-20261114-9010', '2026-11-14 00:30:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-14 00:30:02', '2026-11-14 02:24:02', NULL),
(431, 36, 137, 122, 242, 'seed-outbound.242', 'outbound', -1, 46, 'available', 'order_status', '122', 'Pengurangan stok pesanan FKU-20260920-9121', '2026-09-19 17:57:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-19 17:57:02', '2026-11-14 02:24:02', NULL),
(432, 36, 137, 122, 243, 'seed-outbound.243', 'outbound', -1, 45, 'available', 'order_status', '122', 'Pengurangan stok pesanan FKU-20260920-9121', '2026-09-19 17:57:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-19 17:57:02', '2026-11-14 02:24:02', NULL),
(433, 36, 137, 121, 241, 'seed-outbound.241', 'outbound', -2, 43, 'available', 'order_status', '121', 'Pengurangan stok pesanan FKU-20260921-9120', '2026-09-20 20:08:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-20 20:08:02', '2026-11-14 02:24:02', NULL),
(434, 38, 144, 126, 250, 'seed-outbound.250', 'outbound', -1, 36, 'available', 'order_status', '126', 'Pengurangan stok pesanan FKU-20260915-9125', '2026-09-15 09:13:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-15 09:13:02', '2026-11-14 02:24:02', NULL),
(435, 38, 144, 126, 251, 'seed-outbound.251', 'outbound', -2, 34, 'available', 'order_status', '126', 'Pengurangan stok pesanan FKU-20260915-9125', '2026-09-15 09:13:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-15 09:13:02', '2026-11-14 02:24:02', NULL),
(436, 38, 144, 125, 248, 'seed-outbound.248', 'outbound', -1, 33, 'available', 'order_status', '125', 'Pengurangan stok pesanan FKU-20260916-9124', '2026-09-16 11:24:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-16 11:24:02', '2026-11-14 02:24:02', NULL),
(437, 38, 144, 125, 249, 'seed-outbound.249', 'outbound', -1, 32, 'available', 'order_status', '125', 'Pengurangan stok pesanan FKU-20260916-9124', '2026-09-16 11:24:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-16 11:24:02', '2026-11-14 02:24:02', NULL),
(438, 38, 144, 124, 247, 'seed-outbound.247', 'outbound', -2, 30, 'available', 'order_status', '124', 'Pengurangan stok pesanan FKU-20260917-9123', '2026-09-17 13:35:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-17 13:35:02', '2026-11-14 02:24:02', NULL),
(439, 38, 144, 123, 244, 'seed-outbound.244', 'outbound', -1, 29, 'available', 'order_status', '123', 'Pengurangan stok pesanan FKU-20260918-9122', '2026-09-18 15:46:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-18 15:46:02', '2026-11-14 02:24:02', NULL),
(440, 38, 144, 123, 245, 'seed-outbound.245', 'outbound', -2, 27, 'available', 'order_status', '123', 'Pengurangan stok pesanan FKU-20260918-9122', '2026-09-18 15:46:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-18 15:46:02', '2026-11-14 02:24:02', NULL),
(441, 38, 144, 123, 246, 'seed-outbound.246', 'outbound', -1, 26, 'available', 'order_status', '123', 'Pengurangan stok pesanan FKU-20260918-9122', '2026-09-18 15:46:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-18 15:46:02', '2026-11-14 02:24:02', NULL),
(442, 38, 145, 104, 207, 'seed-outbound.207', 'outbound', -1, 5, 'available', 'order_status', '104', 'Pengurangan stok pesanan FKU-20261009-9103', '2026-10-09 09:15:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-09 09:15:02', '2026-11-14 02:24:02', NULL),
(443, 38, 145, 80, 159, 'seed-outbound.159', 'outbound', -1, 4, 'available', 'order_status', '80', 'Pengurangan stok pesanan FKU-20261104-9079', '2026-11-03 21:47:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-03 21:47:02', '2026-11-14 02:24:02', NULL),
(444, 38, 145, 56, 111, 'seed-outbound.111', 'outbound', -1, 3, 'available', 'order_status', '56', 'Pengurangan stok pesanan FKU-20261109-9055', '2026-11-09 10:11:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-09 10:11:02', '2026-11-14 02:24:02', NULL),
(445, 38, 145, 32, 63, 'seed-outbound.63', 'outbound', -1, 2, 'available', 'order_status', '32', 'Pengurangan stok pesanan FKU-20261113-9031', '2026-11-12 19:53:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-12 19:53:02', '2026-11-14 02:24:02', NULL),
(446, 38, 145, 8, 15, 'seed-outbound.15', 'outbound', -1, 1, 'available', 'order_status', '8', 'Pengurangan stok pesanan FKU-20261114-9007', '2026-11-14 01:21:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-14 01:21:02', '2026-11-14 02:24:02', NULL),
(447, 39, 147, 127, 253, 'seed-outbound.253', 'outbound', -2, 30, 'available', 'order_status', '127', 'Pengurangan stok pesanan FKU-20260914-9126', '2026-09-14 07:02:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-14 07:02:02', '2026-11-14 02:24:02', NULL),
(448, 39, 150, 108, 214, 'seed-outbound.214', 'outbound', -1, 22, 'available', 'order_status', '108', 'Pengurangan stok pesanan FKU-20261005-9107', '2026-10-05 00:31:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-05 00:31:02', '2026-11-14 02:24:02', NULL),
(449, 39, 150, 84, 166, 'seed-outbound.166', 'outbound', -1, 21, 'available', 'order_status', '84', 'Pengurangan stok pesanan FKU-20261103-9083', '2026-11-02 23:43:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-02 23:43:02', '2026-11-14 02:24:02', NULL),
(450, 39, 150, 60, 118, 'seed-outbound.118', 'outbound', -1, 20, 'available', 'order_status', '60', 'Pengurangan stok pesanan FKU-20261108-9059', '2026-11-08 12:07:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-08 12:07:02', '2026-11-14 02:24:02', NULL),
(451, 39, 150, 36, 70, 'seed-outbound.70', 'outbound', -1, 19, 'available', 'order_status', '36', 'Pengurangan stok pesanan FKU-20261112-9035', '2026-11-12 10:45:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-12 10:45:02', '2026-11-14 02:24:02', NULL),
(452, 39, 150, 12, 22, 'seed-outbound.22', 'outbound', -1, 18, 'available', 'order_status', '12', 'Pengurangan stok pesanan FKU-20261114-9011', '2026-11-14 00:08:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-14 00:08:02', '2026-11-14 02:24:02', NULL),
(453, 40, 151, 129, 256, 'seed-outbound.256', 'outbound', -1, 26, 'available', 'order_status', '129', 'Pengurangan stok pesanan FKU-20260912-9128', '2026-09-12 02:40:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-12 02:40:02', '2026-11-14 02:24:02', NULL),
(454, 40, 151, 128, 254, 'seed-outbound.254', 'outbound', -1, 25, 'available', 'order_status', '128', 'Pengurangan stok pesanan FKU-20260913-9127', '2026-09-13 04:51:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-13 04:51:02', '2026-11-14 02:24:02', NULL),
(455, 40, 151, 128, 255, 'seed-outbound.255', 'outbound', -1, 24, 'available', 'order_status', '128', 'Pengurangan stok pesanan FKU-20260913-9127', '2026-09-13 04:51:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-13 04:51:02', '2026-11-14 02:24:02', NULL),
(456, 41, 154, 131, 260, 'seed-outbound.260', 'outbound', -1, 21, 'available', 'order_status', '131', 'Pengurangan stok pesanan FKU-20260910-9130', '2026-09-09 22:18:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-09 22:18:02', '2026-11-14 02:24:02', NULL),
(457, 41, 154, 130, 259, 'seed-outbound.259', 'outbound', -2, 19, 'available', 'order_status', '130', 'Pengurangan stok pesanan FKU-20260911-9129', '2026-09-11 00:29:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-11 00:29:02', '2026-11-14 02:24:02', NULL),
(458, 42, 158, 132, 262, 'seed-outbound.262', 'outbound', -1, 16, 'available', 'order_status', '132', 'Pengurangan stok pesanan FKU-20260909-9131', '2026-09-08 20:07:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-08 20:07:02', '2026-11-14 02:24:02', NULL),
(459, 42, 158, 129, 257, 'seed-outbound.257', 'outbound', -2, 14, 'available', 'order_status', '129', 'Pengurangan stok pesanan FKU-20260912-9128', '2026-09-12 02:40:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-12 02:40:02', '2026-11-14 02:24:02', NULL),
(460, 42, 158, 105, 209, 'seed-outbound.209', 'outbound', -2, 12, 'available', 'order_status', '105', 'Pengurangan stok pesanan FKU-20261008-9104', '2026-10-08 07:04:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-08 07:04:02', '2026-11-14 02:24:02', NULL),
(461, 42, 158, 81, 161, 'seed-outbound.161', 'outbound', -2, 10, 'available', 'order_status', '81', 'Pengurangan stok pesanan FKU-20261103-9080', '2026-11-03 16:16:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-03 16:16:02', '2026-11-14 02:24:02', NULL),
(462, 42, 158, 57, 113, 'seed-outbound.113', 'outbound', -2, 8, 'available', 'order_status', '57', 'Pengurangan stok pesanan FKU-20261109-9056', '2026-11-09 04:40:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-09 04:40:02', '2026-11-14 02:24:02', NULL),
(463, 42, 158, 33, 65, 'seed-outbound.65', 'outbound', -2, 6, 'available', 'order_status', '33', 'Pengurangan stok pesanan FKU-20261113-9032', '2026-11-12 17:36:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-12 17:36:02', '2026-11-14 02:24:02', NULL),
(464, 42, 158, 9, 17, 'seed-outbound.17', 'outbound', -2, 4, 'available', 'order_status', '9', 'Pengurangan stok pesanan FKU-20261114-9008', '2026-11-14 01:07:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-14 01:07:02', '2026-11-14 02:24:02', NULL),
(465, 43, 163, 85, 169, 'seed-outbound.169', 'outbound', -2, 21, 'available', 'order_status', '85', 'Pengurangan stok pesanan FKU-20261030-9084', '2026-10-30 02:44:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-30 02:44:02', '2026-11-14 02:24:02', NULL),
(466, 43, 163, 61, 121, 'seed-outbound.121', 'outbound', -2, 19, 'available', 'order_status', '61', 'Pengurangan stok pesanan FKU-20261108-9060', '2026-11-08 06:36:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-08 06:36:02', '2026-11-14 02:24:02', NULL),
(467, 43, 163, 37, 73, 'seed-outbound.73', 'outbound', -2, 17, 'available', 'order_status', '37', 'Pengurangan stok pesanan FKU-20261112-9036', '2026-11-12 08:28:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-12 08:28:02', '2026-11-14 02:24:02', NULL),
(468, 43, 163, 13, 25, 'seed-outbound.25', 'outbound', -2, 15, 'available', 'order_status', '13', 'Pengurangan stok pesanan FKU-20261114-9012', '2026-11-13 23:39:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 23:39:02', '2026-11-14 02:24:02', NULL),
(469, 44, 166, 126, 252, 'seed-outbound.252', 'outbound', -1, 6, 'available', 'order_status', '126', 'Pengurangan stok pesanan FKU-20260915-9125', '2026-09-15 09:13:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-15 09:13:02', '2026-11-14 02:24:02', NULL),
(470, 44, 166, 102, 204, 'seed-outbound.204', 'outbound', -1, 5, 'available', 'order_status', '102', 'Pengurangan stok pesanan FKU-20261011-9101', '2026-10-11 13:37:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-11 13:37:02', '2026-11-14 02:24:02', NULL),
(471, 44, 166, 78, 156, 'seed-outbound.156', 'outbound', -1, 4, 'available', 'order_status', '78', 'Pengurangan stok pesanan FKU-20261104-9077', '2026-11-04 08:49:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-04 08:49:02', '2026-11-14 02:24:02', NULL),
(472, 44, 166, 54, 108, 'seed-outbound.108', 'outbound', -1, 3, 'available', 'order_status', '54', 'Pengurangan stok pesanan FKU-20261110-9053', '2026-11-09 21:13:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-09 21:13:02', '2026-11-14 02:24:02', NULL),
(473, 44, 166, 30, 60, 'seed-outbound.60', 'outbound', -1, 2, 'available', 'order_status', '30', 'Pengurangan stok pesanan FKU-20261113-9029', '2026-11-13 00:27:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 00:27:02', '2026-11-14 02:24:02', NULL),
(474, 44, 166, 6, 12, 'seed-outbound.12', 'outbound', -1, 1, 'available', 'order_status', '6', 'Pengurangan stok pesanan FKU-20261114-9005', '2026-11-14 01:52:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-14 01:52:02', '2026-11-14 02:24:02', NULL),
(475, 47, 176, 110, 218, 'seed-outbound.218', 'outbound', -1, 33, 'available', 'order_status', '110', 'Pengurangan stok pesanan FKU-20261003-9109', '2026-10-02 20:09:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-02 20:09:02', '2026-11-14 02:24:02', NULL),
(476, 47, 176, 86, 170, 'seed-outbound.170', 'outbound', -1, 32, 'available', 'order_status', '86', 'Pengurangan stok pesanan FKU-20261029-9085', '2026-10-29 00:33:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-29 00:33:02', '2026-11-14 02:24:02', NULL),
(477, 47, 176, 62, 122, 'seed-outbound.122', 'outbound', -1, 31, 'available', 'order_status', '62', 'Pengurangan stok pesanan FKU-20261108-9061', '2026-11-08 01:05:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-08 01:05:02', '2026-11-14 02:24:02', NULL),
(478, 47, 176, 38, 74, 'seed-outbound.74', 'outbound', -1, 30, 'available', 'order_status', '38', 'Pengurangan stok pesanan FKU-20261112-9037', '2026-11-12 06:11:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-12 06:11:02', '2026-11-14 02:24:02', NULL),
(479, 47, 176, 14, 26, 'seed-outbound.26', 'outbound', -1, 29, 'available', 'order_status', '14', 'Pengurangan stok pesanan FKU-20261114-9013', '2026-11-13 23:04:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 23:04:02', '2026-11-14 02:24:02', NULL),
(480, 49, 184, 131, 261, 'seed-outbound.261', 'outbound', -1, 34, 'available', 'order_status', '131', 'Pengurangan stok pesanan FKU-20260910-9130', '2026-09-09 22:18:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-09 22:18:02', '2026-11-14 02:24:02', NULL),
(481, 49, 184, 107, 213, 'seed-outbound.213', 'outbound', -1, 33, 'available', 'order_status', '107', 'Pengurangan stok pesanan FKU-20261006-9106', '2026-10-06 02:42:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-06 02:42:02', '2026-11-14 02:24:02', NULL),
(482, 49, 184, 83, 165, 'seed-outbound.165', 'outbound', -1, 32, 'available', 'order_status', '83', 'Pengurangan stok pesanan FKU-20261103-9082', '2026-11-03 05:14:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-03 05:14:02', '2026-11-14 02:24:02', NULL),
(483, 49, 184, 59, 117, 'seed-outbound.117', 'outbound', -1, 31, 'available', 'order_status', '59', 'Pengurangan stok pesanan FKU-20261109-9058', '2026-11-08 17:38:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-08 17:38:02', '2026-11-14 02:24:02', NULL),
(484, 49, 184, 35, 69, 'seed-outbound.69', 'outbound', -1, 30, 'available', 'order_status', '35', 'Pengurangan stok pesanan FKU-20261112-9034', '2026-11-12 13:02:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-12 13:02:02', '2026-11-14 02:24:02', NULL),
(485, 49, 184, 11, 21, 'seed-outbound.21', 'outbound', -1, 29, 'available', 'order_status', '11', 'Pengurangan stok pesanan FKU-20261114-9010', '2026-11-14 00:30:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-14 00:30:02', '2026-11-14 02:24:02', NULL),
(486, 50, 189, 111, 220, 'seed-outbound.220', 'outbound', -1, 40, 'available', 'order_status', '111', 'Pengurangan stok pesanan FKU-20261002-9110', '2026-10-01 17:58:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-01 17:58:02', '2026-11-14 02:24:02', NULL),
(487, 50, 189, 87, 172, 'seed-outbound.172', 'outbound', -1, 39, 'available', 'order_status', '87', 'Pengurangan stok pesanan FKU-20261028-9086', '2026-10-27 22:22:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-27 22:22:02', '2026-11-14 02:24:02', NULL),
(488, 50, 189, 63, 124, 'seed-outbound.124', 'outbound', -1, 38, 'available', 'order_status', '63', 'Pengurangan stok pesanan FKU-20261108-9062', '2026-11-07 19:34:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-07 19:34:02', '2026-11-14 02:24:02', NULL),
(489, 50, 189, 39, 76, 'seed-outbound.76', 'outbound', -1, 37, 'available', 'order_status', '39', 'Pengurangan stok pesanan FKU-20261112-9038', '2026-11-12 03:54:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-12 03:54:02', '2026-11-14 02:24:02', NULL),
(490, 50, 189, 15, 28, 'seed-outbound.28', 'outbound', -1, 36, 'available', 'order_status', '15', 'Pengurangan stok pesanan FKU-20261114-9014', '2026-11-13 22:19:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 22:19:02', '2026-11-14 02:24:02', NULL),
(491, 52, 197, 132, 263, 'seed-outbound.263', 'outbound', -2, 40, 'available', 'order_status', '132', 'Pengurangan stok pesanan FKU-20260909-9131', '2026-09-08 20:07:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-08 20:07:02', '2026-11-14 02:24:02', NULL),
(492, 52, 197, 108, 215, 'seed-outbound.215', 'outbound', -2, 38, 'available', 'order_status', '108', 'Pengurangan stok pesanan FKU-20261005-9107', '2026-10-05 00:31:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-05 00:31:02', '2026-11-14 02:24:02', NULL),
(493, 52, 197, 84, 167, 'seed-outbound.167', 'outbound', -2, 36, 'available', 'order_status', '84', 'Pengurangan stok pesanan FKU-20261103-9083', '2026-11-02 23:43:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-02 23:43:02', '2026-11-14 02:24:02', NULL),
(494, 52, 197, 60, 119, 'seed-outbound.119', 'outbound', -2, 34, 'available', 'order_status', '60', 'Pengurangan stok pesanan FKU-20261108-9059', '2026-11-08 12:07:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-08 12:07:02', '2026-11-14 02:24:02', NULL),
(495, 52, 197, 36, 71, 'seed-outbound.71', 'outbound', -2, 32, 'available', 'order_status', '36', 'Pengurangan stok pesanan FKU-20261112-9035', '2026-11-12 10:45:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-12 10:45:02', '2026-11-14 02:24:02', NULL),
(496, 52, 197, 12, 23, 'seed-outbound.23', 'outbound', -2, 30, 'available', 'order_status', '12', 'Pengurangan stok pesanan FKU-20261114-9011', '2026-11-14 00:08:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-14 00:08:02', '2026-11-14 02:24:02', NULL),
(497, 54, 202, 112, 223, 'seed-outbound.223', 'outbound', -2, 39, 'available', 'order_status', '112', 'Pengurangan stok pesanan FKU-20260930-9111', '2026-09-30 15:47:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-30 15:47:02', '2026-11-14 02:24:02', NULL),
(498, 54, 202, 88, 175, 'seed-outbound.175', 'outbound', -2, 37, 'available', 'order_status', '88', 'Pengurangan stok pesanan FKU-20261027-9087', '2026-10-26 20:11:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-26 20:11:02', '2026-11-14 02:24:02', NULL),
(499, 54, 202, 64, 127, 'seed-outbound.127', 'outbound', -2, 35, 'available', 'order_status', '64', 'Pengurangan stok pesanan FKU-20261107-9063', '2026-11-07 14:03:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-07 14:03:02', '2026-11-14 02:24:02', NULL),
(500, 54, 202, 40, 79, 'seed-outbound.79', 'outbound', -2, 33, 'available', 'order_status', '40', 'Pengurangan stok pesanan FKU-20261112-9039', '2026-11-12 01:37:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-12 01:37:02', '2026-11-14 02:24:02', NULL),
(501, 54, 202, 16, 31, 'seed-outbound.31', 'outbound', -2, 31, 'available', 'order_status', '16', 'Pengurangan stok pesanan FKU-20261114-9015', '2026-11-13 21:34:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 21:34:02', '2026-11-14 02:24:02', NULL),
(502, 54, 205, 129, 258, 'seed-outbound.258', 'outbound', -1, 31, 'available', 'order_status', '129', 'Pengurangan stok pesanan FKU-20260912-9128', '2026-09-12 02:40:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-12 02:40:02', '2026-11-14 02:24:02', NULL),
(503, 54, 205, 105, 210, 'seed-outbound.210', 'outbound', -1, 30, 'available', 'order_status', '105', 'Pengurangan stok pesanan FKU-20261008-9104', '2026-10-08 07:04:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-08 07:04:02', '2026-11-14 02:24:02', NULL),
(504, 54, 205, 81, 162, 'seed-outbound.162', 'outbound', -1, 29, 'available', 'order_status', '81', 'Pengurangan stok pesanan FKU-20261103-9080', '2026-11-03 16:16:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-03 16:16:02', '2026-11-14 02:24:02', NULL),
(505, 54, 205, 57, 114, 'seed-outbound.114', 'outbound', -1, 28, 'available', 'order_status', '57', 'Pengurangan stok pesanan FKU-20261109-9056', '2026-11-09 04:40:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-09 04:40:02', '2026-11-14 02:24:02', NULL),
(506, 54, 205, 33, 66, 'seed-outbound.66', 'outbound', -1, 27, 'available', 'order_status', '33', 'Pengurangan stok pesanan FKU-20261113-9032', '2026-11-12 17:36:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-12 17:36:02', '2026-11-14 02:24:02', NULL),
(507, 54, 205, 9, 18, 'seed-outbound.18', 'outbound', -1, 26, 'available', 'order_status', '9', 'Pengurangan stok pesanan FKU-20261114-9008', '2026-11-14 01:07:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-14 01:07:02', '2026-11-14 02:24:02', NULL),
(508, 57, 215, 113, 224, 'seed-outbound.224', 'outbound', -1, 5, 'available', 'order_status', '113', 'Pengurangan stok pesanan FKU-20260929-9112', '2026-09-29 13:36:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-29 13:36:02', '2026-11-14 02:24:02', NULL),
(509, 57, 215, 89, 176, 'seed-outbound.176', 'outbound', -1, 4, 'available', 'order_status', '89', 'Pengurangan stok pesanan FKU-20261026-9088', '2026-10-25 18:00:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-25 18:00:02', '2026-11-14 02:24:02', NULL),
(510, 57, 215, 65, 128, 'seed-outbound.128', 'outbound', -1, 3, 'available', 'order_status', '65', 'Pengurangan stok pesanan FKU-20261107-9064', '2026-11-07 08:32:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-07 08:32:02', '2026-11-14 02:24:02', NULL),
(511, 57, 215, 41, 80, 'seed-outbound.80', 'outbound', -1, 2, 'available', 'order_status', '41', 'Pengurangan stok pesanan FKU-20261112-9040', '2026-11-11 23:20:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-11 23:20:02', '2026-11-14 02:24:02', NULL),
(512, 57, 215, 17, 32, 'seed-outbound.32', 'outbound', -1, 1, 'available', 'order_status', '17', 'Pengurangan stok pesanan FKU-20261114-9016', '2026-11-13 20:44:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 20:44:02', '2026-11-14 02:24:02', NULL),
(513, 60, 227, 110, 219, 'seed-outbound.219', 'outbound', -1, 21, 'available', 'order_status', '110', 'Pengurangan stok pesanan FKU-20261003-9109', '2026-10-02 20:09:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-02 20:09:02', '2026-11-14 02:24:02', NULL),
(514, 60, 227, 86, 171, 'seed-outbound.171', 'outbound', -1, 20, 'available', 'order_status', '86', 'Pengurangan stok pesanan FKU-20261029-9085', '2026-10-29 00:33:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-29 00:33:02', '2026-11-14 02:24:02', NULL),
(515, 60, 227, 62, 123, 'seed-outbound.123', 'outbound', -1, 19, 'available', 'order_status', '62', 'Pengurangan stok pesanan FKU-20261108-9061', '2026-11-08 01:05:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-08 01:05:02', '2026-11-14 02:24:02', NULL),
(516, 60, 227, 38, 75, 'seed-outbound.75', 'outbound', -1, 18, 'available', 'order_status', '38', 'Pengurangan stok pesanan FKU-20261112-9037', '2026-11-12 06:11:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-12 06:11:02', '2026-11-14 02:24:02', NULL),
(517, 60, 227, 14, 27, 'seed-outbound.27', 'outbound', -1, 17, 'available', 'order_status', '14', 'Pengurangan stok pesanan FKU-20261114-9013', '2026-11-13 23:04:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 23:04:02', '2026-11-14 02:24:02', NULL),
(518, 61, 232, 114, 226, 'seed-outbound.226', 'outbound', -1, 16, 'available', 'order_status', '114', 'Pengurangan stok pesanan FKU-20260928-9113', '2026-09-28 11:25:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-28 11:25:02', '2026-11-14 02:24:02', NULL),
(519, 61, 232, 90, 178, 'seed-outbound.178', 'outbound', -1, 15, 'available', 'order_status', '90', 'Pengurangan stok pesanan FKU-20261024-9089', '2026-10-24 15:49:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-24 15:49:02', '2026-11-14 02:24:02', NULL),
(520, 61, 232, 66, 130, 'seed-outbound.130', 'outbound', -1, 14, 'available', 'order_status', '66', 'Pengurangan stok pesanan FKU-20261107-9065', '2026-11-07 03:01:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-07 03:01:02', '2026-11-14 02:24:02', NULL),
(521, 61, 232, 42, 82, 'seed-outbound.82', 'outbound', -1, 13, 'available', 'order_status', '42', 'Pengurangan stok pesanan FKU-20261112-9041', '2026-11-11 21:03:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-11 21:03:02', '2026-11-14 02:24:02', NULL),
(522, 61, 232, 18, 34, 'seed-outbound.34', 'outbound', -1, 12, 'available', 'order_status', '18', 'Pengurangan stok pesanan FKU-20261114-9017', '2026-11-13 19:49:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 19:49:02', '2026-11-14 02:24:02', NULL),
(523, 62, 240, 111, 221, 'seed-outbound.221', 'outbound', -2, 43, 'available', 'order_status', '111', 'Pengurangan stok pesanan FKU-20261002-9110', '2026-10-01 17:58:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-01 17:58:02', '2026-11-14 02:24:02', NULL),
(524, 62, 240, 87, 173, 'seed-outbound.173', 'outbound', -2, 41, 'available', 'order_status', '87', 'Pengurangan stok pesanan FKU-20261028-9086', '2026-10-27 22:22:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-27 22:22:02', '2026-11-14 02:24:02', NULL),
(525, 62, 240, 63, 125, 'seed-outbound.125', 'outbound', -2, 39, 'available', 'order_status', '63', 'Pengurangan stok pesanan FKU-20261108-9062', '2026-11-07 19:34:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-07 19:34:02', '2026-11-14 02:24:02', NULL),
(526, 62, 240, 39, 77, 'seed-outbound.77', 'outbound', -2, 37, 'available', 'order_status', '39', 'Pengurangan stok pesanan FKU-20261112-9038', '2026-11-12 03:54:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-12 03:54:02', '2026-11-14 02:24:02', NULL),
(527, 62, 240, 15, 29, 'seed-outbound.29', 'outbound', -2, 35, 'available', 'order_status', '15', 'Pengurangan stok pesanan FKU-20261114-9014', '2026-11-13 22:19:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 22:19:02', '2026-11-14 02:24:02', NULL),
(528, 63, 245, 115, 229, 'seed-outbound.229', 'outbound', -2, 38, 'available', 'order_status', '115', 'Pengurangan stok pesanan FKU-20260927-9114', '2026-09-27 09:14:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-27 09:14:02', '2026-11-14 02:24:02', NULL),
(529, 63, 245, 91, 181, 'seed-outbound.181', 'outbound', -2, 36, 'available', 'order_status', '91', 'Pengurangan stok pesanan FKU-20261023-9090', '2026-10-23 13:38:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-23 13:38:02', '2026-11-14 02:24:02', NULL),
(530, 63, 245, 67, 133, 'seed-outbound.133', 'outbound', -2, 34, 'available', 'order_status', '67', 'Pengurangan stok pesanan FKU-20261107-9066', '2026-11-06 21:30:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-06 21:30:02', '2026-11-14 02:24:02', NULL),
(531, 63, 245, 43, 85, 'seed-outbound.85', 'outbound', -2, 32, 'available', 'order_status', '43', 'Pengurangan stok pesanan FKU-20261112-9042', '2026-11-11 18:46:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-11 18:46:02', '2026-11-14 02:24:02', NULL),
(532, 63, 245, 19, 37, 'seed-outbound.37', 'outbound', -2, 30, 'available', 'order_status', '19', 'Pengurangan stok pesanan FKU-20261114-9018', '2026-11-13 18:54:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 18:54:02', '2026-11-14 02:24:02', NULL),
(533, 64, 248, 132, 264, 'seed-outbound.264', 'outbound', -1, 12, 'available', 'order_status', '132', 'Pengurangan stok pesanan FKU-20260909-9131', '2026-09-08 20:07:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-08 20:07:02', '2026-11-14 02:24:02', NULL),
(534, 64, 248, 108, 216, 'seed-outbound.216', 'outbound', -1, 11, 'available', 'order_status', '108', 'Pengurangan stok pesanan FKU-20261005-9107', '2026-10-05 00:31:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-05 00:31:02', '2026-11-14 02:24:02', NULL),
(535, 64, 248, 84, 168, 'seed-outbound.168', 'outbound', -1, 10, 'available', 'order_status', '84', 'Pengurangan stok pesanan FKU-20261103-9083', '2026-11-02 23:43:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-02 23:43:02', '2026-11-14 02:24:02', NULL),
(536, 64, 248, 60, 120, 'seed-outbound.120', 'outbound', -1, 9, 'available', 'order_status', '60', 'Pengurangan stok pesanan FKU-20261108-9059', '2026-11-08 12:07:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-08 12:07:02', '2026-11-14 02:24:02', NULL),
(537, 64, 248, 36, 72, 'seed-outbound.72', 'outbound', -1, 8, 'available', 'order_status', '36', 'Pengurangan stok pesanan FKU-20261112-9035', '2026-11-12 10:45:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-12 10:45:02', '2026-11-14 02:24:02', NULL),
(538, 64, 248, 12, 24, 'seed-outbound.24', 'outbound', -1, 7, 'available', 'order_status', '12', 'Pengurangan stok pesanan FKU-20261114-9011', '2026-11-14 00:08:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-14 00:08:02', '2026-11-14 02:24:02', NULL),
(539, 66, 258, 116, 230, 'seed-outbound.230', 'outbound', -1, 44, 'available', 'order_status', '116', 'Pengurangan stok pesanan FKU-20260926-9115', '2026-09-26 07:03:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-26 07:03:02', '2026-11-14 02:24:02', NULL),
(540, 66, 258, 92, 182, 'seed-outbound.182', 'outbound', -1, 43, 'available', 'order_status', '92', 'Pengurangan stok pesanan FKU-20261022-9091', '2026-10-22 11:27:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-22 11:27:02', '2026-11-14 02:24:02', NULL),
(541, 66, 258, 68, 134, 'seed-outbound.134', 'outbound', -1, 42, 'available', 'order_status', '68', 'Pengurangan stok pesanan FKU-20261106-9067', '2026-11-06 15:59:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-06 15:59:02', '2026-11-14 02:24:02', NULL),
(542, 66, 258, 44, 86, 'seed-outbound.86', 'outbound', -1, 41, 'available', 'order_status', '44', 'Pengurangan stok pesanan FKU-20261111-9043', '2026-11-11 16:29:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-11 16:29:02', '2026-11-14 02:24:02', NULL),
(543, 66, 258, 20, 38, 'seed-outbound.38', 'outbound', -1, 40, 'available', 'order_status', '20', 'Pengurangan stok pesanan FKU-20261114-9019', '2026-11-13 17:44:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 17:44:02', '2026-11-14 02:24:02', NULL),
(544, 68, 266, 113, 225, 'seed-outbound.225', 'outbound', -1, 12, 'available', 'order_status', '113', 'Pengurangan stok pesanan FKU-20260929-9112', '2026-09-29 13:36:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-29 13:36:02', '2026-11-14 02:24:02', NULL),
(545, 68, 266, 89, 177, 'seed-outbound.177', 'outbound', -1, 11, 'available', 'order_status', '89', 'Pengurangan stok pesanan FKU-20261026-9088', '2026-10-25 18:00:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-25 18:00:02', '2026-11-14 02:24:02', NULL),
(546, 68, 266, 65, 129, 'seed-outbound.129', 'outbound', -1, 10, 'available', 'order_status', '65', 'Pengurangan stok pesanan FKU-20261107-9064', '2026-11-07 08:32:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-07 08:32:02', '2026-11-14 02:24:02', NULL),
(547, 68, 266, 41, 81, 'seed-outbound.81', 'outbound', -1, 9, 'available', 'order_status', '41', 'Pengurangan stok pesanan FKU-20261112-9040', '2026-11-11 23:20:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-11 23:20:02', '2026-11-14 02:24:02', NULL),
(548, 68, 266, 17, 33, 'seed-outbound.33', 'outbound', -1, 8, 'available', 'order_status', '17', 'Pengurangan stok pesanan FKU-20261114-9016', '2026-11-13 20:44:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 20:44:02', '2026-11-14 02:24:02', NULL),
(549, 69, 271, 117, 232, 'seed-outbound.232', 'outbound', -1, 7, 'available', 'order_status', '117', 'Pengurangan stok pesanan FKU-20260925-9116', '2026-09-25 04:52:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-25 04:52:02', '2026-11-14 02:24:02', NULL),
(550, 69, 271, 93, 184, 'seed-outbound.184', 'outbound', -1, 6, 'available', 'order_status', '93', 'Pengurangan stok pesanan FKU-20261021-9092', '2026-10-21 09:16:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-21 09:16:02', '2026-11-14 02:24:02', NULL),
(551, 69, 271, 69, 136, 'seed-outbound.136', 'outbound', -1, 5, 'available', 'order_status', '69', 'Pengurangan stok pesanan FKU-20261106-9068', '2026-11-06 10:28:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-06 10:28:02', '2026-11-14 02:24:02', NULL),
(552, 69, 271, 45, 88, 'seed-outbound.88', 'outbound', -1, 4, 'available', 'order_status', '45', 'Pengurangan stok pesanan FKU-20261111-9044', '2026-11-11 14:12:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-11 14:12:02', '2026-11-14 02:24:02', NULL),
(553, 69, 271, 21, 40, 'seed-outbound.40', 'outbound', -1, 3, 'available', 'order_status', '21', 'Pengurangan stok pesanan FKU-20261113-9020', '2026-11-13 16:34:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 16:34:02', '2026-11-14 02:24:02', NULL),
(554, 70, 279, 114, 227, 'seed-outbound.227', 'outbound', -2, 23, 'available', 'order_status', '114', 'Pengurangan stok pesanan FKU-20260928-9113', '2026-09-28 11:25:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-28 11:25:02', '2026-11-14 02:24:02', NULL),
(555, 70, 279, 90, 179, 'seed-outbound.179', 'outbound', -2, 21, 'available', 'order_status', '90', 'Pengurangan stok pesanan FKU-20261024-9089', '2026-10-24 15:49:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-24 15:49:02', '2026-11-14 02:24:02', NULL),
(556, 70, 279, 66, 131, 'seed-outbound.131', 'outbound', -2, 19, 'available', 'order_status', '66', 'Pengurangan stok pesanan FKU-20261107-9065', '2026-11-07 03:01:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-07 03:01:02', '2026-11-14 02:24:02', NULL),
(557, 70, 279, 42, 83, 'seed-outbound.83', 'outbound', -2, 17, 'available', 'order_status', '42', 'Pengurangan stok pesanan FKU-20261112-9041', '2026-11-11 21:03:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-11 21:03:02', '2026-11-14 02:24:02', NULL),
(558, 70, 279, 18, 35, 'seed-outbound.35', 'outbound', -2, 15, 'available', 'order_status', '18', 'Pengurangan stok pesanan FKU-20261114-9017', '2026-11-13 19:49:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 19:49:02', '2026-11-14 02:24:02', NULL),
(559, 71, 284, 118, 235, 'seed-outbound.235', 'outbound', -2, 18, 'available', 'order_status', '118', 'Pengurangan stok pesanan FKU-20260924-9117', '2026-09-24 02:41:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-24 02:41:02', '2026-11-14 02:24:02', NULL),
(560, 71, 284, 94, 187, 'seed-outbound.187', 'outbound', -2, 16, 'available', 'order_status', '94', 'Pengurangan stok pesanan FKU-20261020-9093', '2026-10-20 07:05:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-20 07:05:02', '2026-11-14 02:24:02', NULL),
(561, 71, 284, 70, 139, 'seed-outbound.139', 'outbound', -2, 14, 'available', 'order_status', '70', 'Pengurangan stok pesanan FKU-20261106-9069', '2026-11-06 04:57:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-06 04:57:02', '2026-11-14 02:24:02', NULL),
(562, 71, 284, 46, 91, 'seed-outbound.91', 'outbound', -2, 12, 'available', 'order_status', '46', 'Pengurangan stok pesanan FKU-20261111-9045', '2026-11-11 11:55:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-11 11:55:02', '2026-11-14 02:24:02', NULL),
(563, 71, 284, 22, 43, 'seed-outbound.43', 'outbound', -2, 10, 'available', 'order_status', '22', 'Pengurangan stok pesanan FKU-20261113-9021', '2026-11-13 15:14:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 15:14:02', '2026-11-14 02:24:02', NULL),
(564, 71, 287, 111, 222, 'seed-outbound.222', 'outbound', -1, 10, 'available', 'order_status', '111', 'Pengurangan stok pesanan FKU-20261002-9110', '2026-10-01 17:58:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-01 17:58:02', '2026-11-14 02:24:02', NULL),
(565, 71, 287, 87, 174, 'seed-outbound.174', 'outbound', -1, 9, 'available', 'order_status', '87', 'Pengurangan stok pesanan FKU-20261028-9086', '2026-10-27 22:22:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-27 22:22:02', '2026-11-14 02:24:02', NULL),
(566, 71, 287, 63, 126, 'seed-outbound.126', 'outbound', -1, 8, 'available', 'order_status', '63', 'Pengurangan stok pesanan FKU-20261108-9062', '2026-11-07 19:34:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-07 19:34:02', '2026-11-14 02:24:02', NULL),
(567, 71, 287, 39, 78, 'seed-outbound.78', 'outbound', -1, 7, 'available', 'order_status', '39', 'Pengurangan stok pesanan FKU-20261112-9038', '2026-11-12 03:54:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-12 03:54:02', '2026-11-14 02:24:02', NULL),
(568, 71, 287, 15, 30, 'seed-outbound.30', 'outbound', -1, 6, 'available', 'order_status', '15', 'Pengurangan stok pesanan FKU-20261114-9014', '2026-11-13 22:19:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 22:19:02', '2026-11-14 02:24:02', NULL),
(569, 73, 297, 119, 236, 'seed-outbound.236', 'outbound', -1, 31, 'available', 'order_status', '119', 'Pengurangan stok pesanan FKU-20260923-9118', '2026-09-23 00:30:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-23 00:30:02', '2026-11-14 02:24:02', NULL),
(570, 73, 297, 95, 188, 'seed-outbound.188', 'outbound', -1, 30, 'available', 'order_status', '95', 'Pengurangan stok pesanan FKU-20261019-9094', '2026-10-19 04:54:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-19 04:54:02', '2026-11-14 02:24:02', NULL),
(571, 73, 297, 71, 140, 'seed-outbound.140', 'outbound', -1, 29, 'available', 'order_status', '71', 'Pengurangan stok pesanan FKU-20261106-9070', '2026-11-05 23:26:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-05 23:26:02', '2026-11-14 02:24:02', NULL),
(572, 73, 297, 47, 92, 'seed-outbound.92', 'outbound', -1, 28, 'available', 'order_status', '47', 'Pengurangan stok pesanan FKU-20261111-9046', '2026-11-11 09:38:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-11 09:38:02', '2026-11-14 02:24:02', NULL),
(573, 73, 297, 23, 44, 'seed-outbound.44', 'outbound', -1, 27, 'available', 'order_status', '23', 'Pengurangan stok pesanan FKU-20261113-9022', '2026-11-13 13:44:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 13:44:02', '2026-11-14 02:24:02', NULL),
(574, 82, 310, 116, 231, 'seed-outbound.231', 'outbound', -1, 26, 'available', 'order_status', '116', 'Pengurangan stok pesanan FKU-20260926-9115', '2026-09-26 07:03:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-26 07:03:02', '2026-11-14 02:24:02', NULL),
(575, 82, 310, 92, 183, 'seed-outbound.183', 'outbound', -1, 25, 'available', 'order_status', '92', 'Pengurangan stok pesanan FKU-20261022-9091', '2026-10-22 11:27:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-22 11:27:02', '2026-11-14 02:24:02', NULL),
(576, 82, 310, 68, 135, 'seed-outbound.135', 'outbound', -1, 24, 'available', 'order_status', '68', 'Pengurangan stok pesanan FKU-20261106-9067', '2026-11-06 15:59:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-06 15:59:02', '2026-11-14 02:24:02', NULL),
(577, 82, 310, 44, 87, 'seed-outbound.87', 'outbound', -1, 23, 'available', 'order_status', '44', 'Pengurangan stok pesanan FKU-20261111-9043', '2026-11-11 16:29:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-11 16:29:02', '2026-11-14 02:24:02', NULL),
(578, 82, 310, 20, 39, 'seed-outbound.39', 'outbound', -1, 22, 'available', 'order_status', '20', 'Pengurangan stok pesanan FKU-20261114-9019', '2026-11-13 17:44:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 17:44:02', '2026-11-14 02:24:02', NULL),
(579, 88, 316, 120, 238, 'seed-outbound.238', 'outbound', -1, 38, 'available', 'order_status', '120', 'Pengurangan stok pesanan FKU-20260922-9119', '2026-09-21 22:19:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-21 22:19:02', '2026-11-14 02:24:02', NULL),
(580, 88, 316, 96, 190, 'seed-outbound.190', 'outbound', -1, 37, 'available', 'order_status', '96', 'Pengurangan stok pesanan FKU-20261018-9095', '2026-10-18 02:43:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-18 02:43:02', '2026-11-14 02:24:02', NULL);
INSERT INTO `stock_movements` (`id`, `product_id`, `variant_id`, `order_id`, `order_item_id`, `movement_key`, `type`, `quantity_delta`, `balance_after`, `stock_dimension`, `reference_type`, `reference_id`, `notes`, `occurred_at`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(581, 88, 316, 72, 142, 'seed-outbound.142', 'outbound', -1, 36, 'available', 'order_status', '72', 'Pengurangan stok pesanan FKU-20261106-9071', '2026-11-05 17:55:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-05 17:55:02', '2026-11-14 02:24:02', NULL),
(582, 88, 316, 48, 94, 'seed-outbound.94', 'outbound', -1, 35, 'available', 'order_status', '48', 'Pengurangan stok pesanan FKU-20261111-9047', '2026-11-11 07:21:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-11 07:21:02', '2026-11-14 02:24:02', NULL),
(583, 88, 316, 24, 46, 'seed-outbound.46', 'outbound', -1, 34, 'available', 'order_status', '24', 'Pengurangan stok pesanan FKU-20261113-9023', '2026-11-13 12:14:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 12:14:02', '2026-11-14 02:24:02', NULL),
(584, 96, 324, 117, 233, 'seed-outbound.233', 'outbound', -2, 39, 'available', 'order_status', '117', 'Pengurangan stok pesanan FKU-20260925-9116', '2026-09-25 04:52:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-09-25 04:52:02', '2026-11-14 02:24:02', NULL),
(585, 96, 324, 93, 185, 'seed-outbound.185', 'outbound', -2, 37, 'available', 'order_status', '93', 'Pengurangan stok pesanan FKU-20261021-9092', '2026-10-21 09:16:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-10-21 09:16:02', '2026-11-14 02:24:02', NULL),
(586, 96, 324, 69, 137, 'seed-outbound.137', 'outbound', -2, 35, 'available', 'order_status', '69', 'Pengurangan stok pesanan FKU-20261106-9068', '2026-11-06 10:28:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-06 10:28:02', '2026-11-14 02:24:02', NULL),
(587, 96, 324, 45, 89, 'seed-outbound.89', 'outbound', -2, 33, 'available', 'order_status', '45', 'Pengurangan stok pesanan FKU-20261111-9044', '2026-11-11 14:12:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-11 14:12:02', '2026-11-14 02:24:02', NULL),
(588, 96, 324, 21, 41, 'seed-outbound.41', 'outbound', -2, 31, 'available', 'order_status', '21', 'Pengurangan stok pesanan FKU-20261113-9020', '2026-11-13 16:34:02', 'ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, '2026-11-13 16:34:02', '2026-11-14 02:24:02', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sub_orders`
--

CREATE TABLE `sub_orders` (
  `id` bigint UNSIGNED NOT NULL,
  `order_id` bigint UNSIGNED NOT NULL,
  `sub_order_number` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_items_price` decimal(15,2) NOT NULL DEFAULT '0.00',
  `shipping_cost` decimal(15,2) NOT NULL DEFAULT '0.00',
  `courier` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `service` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `destination_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `tracking_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sub_orders`
--

INSERT INTO `sub_orders` (`id`, `order_id`, `sub_order_number`, `total_items_price`, `shipping_cost`, `courier`, `service`, `destination_id`, `status`, `tracking_number`, `created_at`, `updated_at`) VALUES
(1, 1, 'FKU-20261114-9000-1', 178000.00, 18000.00, 'JNE', 'REG', 'KMB-602-012', 'pending', NULL, '2026-11-14 02:20:02', '2026-11-14 02:23:02'),
(2, 2, 'FKU-20261114-9001-1', 338000.00, 0.00, 'J&T Express', 'YES', 'KMB-121-049', 'pending', NULL, '2026-11-14 02:13:02', '2026-11-14 02:17:02'),
(3, 3, 'FKU-20261114-9002-1', 1386000.00, 0.00, 'SiCepat', 'REG', 'KMB-612-086', 'pending', NULL, '2026-11-14 02:05:02', '2026-11-14 02:10:02'),
(4, 4, 'FKU-20261114-9003-1', 378000.00, 0.00, 'AnterAja', 'REG', 'KMB-114-027', 'cancelled', NULL, '2026-11-14 01:57:02', '2026-11-14 02:11:02'),
(5, 5, 'FKU-20261114-9004-1', 648000.00, 0.00, 'Lion Parcel', 'REG', 'KMB-805-064', 'pending', NULL, '2026-11-14 01:46:02', '2026-11-14 01:53:02'),
(6, 6, 'FKU-20261114-9005-1', 1026000.00, 0.00, 'JNE', 'JTR', 'KMB-401-005', 'pending', NULL, '2026-11-14 01:32:02', '2026-11-14 01:40:02'),
(7, 7, 'FKU-20261114-9006-1', 998000.00, 0.00, 'JNE', 'REG', 'KMB-301-042', 'processing', NULL, '2026-11-14 01:18:02', '2026-11-14 01:27:02'),
(8, 8, 'FKU-20261114-9007-1', 398000.00, 0.00, 'J&T Express', 'YES', 'KMB-164-079', 'pending', NULL, '2026-11-14 01:01:02', '2026-11-14 01:11:02'),
(9, 9, 'FKU-20261114-9008-1', 1256000.00, 0.00, 'SiCepat', 'REG', 'KMB-351-020', 'pending', NULL, '2026-11-14 00:47:02', '2026-11-14 00:58:02'),
(10, 10, 'FKU-20261114-9009-1', 578000.00, 0.00, 'AnterAja', 'REG', 'KMB-571-057', 'processing', NULL, '2026-11-14 00:29:02', '2026-11-14 00:41:02'),
(11, 11, 'FKU-20261114-9010-1', 538000.00, 0.00, 'Lion Parcel', 'REG', 'KMB-761-094', 'pending', NULL, '2026-11-14 00:10:02', '2026-11-14 00:23:02'),
(12, 12, 'FKU-20261114-9011-1', 1296000.00, 0.00, 'JNE', 'JTR', 'KMB-552-035', 'pending', NULL, '2026-11-13 23:48:02', '2026-11-14 00:02:02'),
(13, 13, 'FKU-20261114-9012-1', 458000.00, 0.00, 'JNE', 'REG', 'KMB-233-072', 'processing', NULL, '2026-11-13 23:19:02', '2026-11-13 23:34:02'),
(14, 14, 'FKU-20261114-9013-1', 638000.00, 0.00, 'J&T Express', 'YES', 'KMB-651-013', 'processing', NULL, '2026-11-13 22:44:02', '2026-11-13 23:00:02'),
(15, 15, 'FKU-20261114-9014-1', 1146000.00, 0.00, 'SiCepat', 'REG', 'KMB-103-050', 'processing', NULL, '2026-11-13 21:59:02', '2026-11-13 22:16:02'),
(16, 16, 'FKU-20261114-9015-1', 718000.00, 0.00, 'AnterAja', 'REG', 'KMB-802-087', 'shipped', 'AN810000000016', '2026-11-13 21:14:02', '2026-11-13 23:34:02'),
(17, 17, 'FKU-20261114-9016-1', 708000.00, 0.00, 'Lion Parcel', 'REG', 'KMB-401-028', 'processing', NULL, '2026-11-13 20:24:02', '2026-11-13 20:43:02'),
(18, 18, 'FKU-20261114-9017-1', 1376000.00, 0.00, 'JNE', 'JTR', 'KMB-201-065', 'processing', NULL, '2026-11-13 19:29:02', '2026-11-13 19:49:02'),
(19, 19, 'FKU-20261114-9018-1', 1298000.00, 0.00, 'JNE', 'REG', 'KMB-171-006', 'processing', NULL, '2026-11-13 18:34:02', '2026-11-13 18:55:02'),
(20, 20, 'FKU-20261114-9019-1', 838000.00, 0.00, 'J&T Express', 'YES', 'KMB-282-043', 'processing', NULL, '2026-11-13 17:24:02', '2026-11-13 17:46:02'),
(21, 21, 'FKU-20261113-9020-1', 1246000.00, 0.00, 'SiCepat', 'REG', 'KMB-502-080', 'received', 'SI810000000021', '2026-11-13 16:14:02', '2026-11-13 23:21:02'),
(22, 22, 'FKU-20261113-9021-1', 238000.00, 24000.00, 'AnterAja', 'REG', 'KMB-902-021', 'shipped', 'AN810000000022', '2026-11-13 14:54:02', '2026-11-13 20:05:02'),
(23, 23, 'FKU-20261113-9022-1', 418000.00, 0.00, 'Lion Parcel', 'REG', 'KMB-552-058', 'shipped', 'LI810000000023', '2026-11-13 13:24:02', '2026-11-13 19:15:02'),
(24, 24, 'FKU-20261113-9023-1', 706000.00, 0.00, 'JNE', 'JTR', 'KMB-831-095', 'shipped', 'JN810000000024', '2026-11-13 11:54:02', '2026-11-13 18:26:02'),
(25, 25, 'FKU-20261113-9024-1', 238000.00, 42000.00, 'JNE', 'REG', 'KMB-602-036', 'received', 'JN810000000025', '2026-11-13 10:24:02', '2026-11-13 21:36:02'),
(26, 26, 'FKU-20261113-9025-1', 308000.00, 0.00, 'J&T Express', 'YES', 'KMB-121-073', 'shipped', 'JT810000000026', '2026-11-13 08:24:02', '2026-11-13 16:30:02'),
(27, 27, 'FKU-20261113-9026-1', 1386000.00, 0.00, 'SiCepat', 'REG', 'KMB-612-014', 'shipped', 'SI810000000027', '2026-11-13 06:24:02', '2026-11-13 15:24:02'),
(28, 28, 'FKU-20261113-9027-1', 378000.00, 0.00, 'AnterAja', 'REG', 'KMB-114-051', 'shipped', 'AN810000000028', '2026-11-13 04:24:02', '2026-11-13 14:18:02'),
(29, 29, 'FKU-20261113-9028-1', 648000.00, 0.00, 'Lion Parcel', 'REG', 'KMB-805-088', 'shipped', 'LI810000000029', '2026-11-13 02:24:02', '2026-11-13 13:12:02'),
(30, 30, 'FKU-20261113-9029-1', 1026000.00, 0.00, 'JNE', 'JTR', 'KMB-401-029', 'shipped', 'JN810000000030', '2026-11-13 00:07:02', '2026-11-13 11:57:02'),
(31, 31, 'FKU-20261113-9030-1', 998000.00, 0.00, 'JNE', 'REG', 'KMB-301-066', 'received', 'JN810000000031', '2026-11-12 21:50:02', '2026-11-13 17:50:02'),
(32, 32, 'FKU-20261113-9031-1', 398000.00, 0.00, 'J&T Express', 'YES', 'KMB-164-007', 'shipped', 'JT810000000032', '2026-11-12 19:33:02', '2026-11-13 09:26:02'),
(33, 33, 'FKU-20261113-9032-1', 1256000.00, 0.00, 'SiCepat', 'REG', 'KMB-351-044', 'shipped', 'SI810000000033', '2026-11-12 17:16:02', '2026-11-13 08:11:02'),
(34, 34, 'FKU-20261112-9033-1', 578000.00, 0.00, 'AnterAja', 'REG', 'KMB-571-081', 'received', 'AN810000000034', '2026-11-12 14:59:02', '2026-11-13 15:47:02'),
(35, 35, 'FKU-20261112-9034-1', 538000.00, 0.00, 'Lion Parcel', 'REG', 'KMB-761-022', 'shipped', 'LI810000000035', '2026-11-12 12:42:02', '2026-11-13 05:40:02'),
(36, 36, 'FKU-20261112-9035-1', 1296000.00, 0.00, 'JNE', 'JTR', 'KMB-552-059', 'shipped', 'JN810000000036', '2026-11-12 10:25:02', '2026-11-13 04:25:02'),
(37, 37, 'FKU-20261112-9036-1', 458000.00, 0.00, 'JNE', 'REG', 'KMB-233-096', 'received', 'JN810000000037', '2026-11-12 08:08:02', '2026-11-13 13:43:02'),
(38, 38, 'FKU-20261112-9037-1', 638000.00, 0.00, 'J&T Express', 'YES', 'KMB-651-037', 'shipped', 'JT810000000038', '2026-11-12 05:51:02', '2026-11-13 01:54:02'),
(39, 39, 'FKU-20261112-9038-1', 1146000.00, 0.00, 'SiCepat', 'REG', 'KMB-103-074', 'shipped', 'SI810000000039', '2026-11-12 03:34:02', '2026-11-13 00:39:02'),
(40, 40, 'FKU-20261112-9039-1', 718000.00, 0.00, 'AnterAja', 'REG', 'KMB-802-015', 'received', 'AN810000000040', '2026-11-12 01:17:02', '2026-11-13 11:40:02'),
(41, 41, 'FKU-20261112-9040-1', 708000.00, 0.00, 'Lion Parcel', 'REG', 'KMB-401-052', 'shipped', 'LI810000000041', '2026-11-11 23:00:02', '2026-11-12 22:08:02'),
(42, 42, 'FKU-20261112-9041-1', 1326000.00, 0.00, 'JNE', 'JTR', 'KMB-201-089', 'shipped', 'JN810000000042', '2026-11-11 20:43:02', '2026-11-12 20:52:02'),
(43, 43, 'FKU-20261112-9042-1', 1298000.00, 0.00, 'JNE', 'REG', 'KMB-171-030', 'received', 'JN810000000043', '2026-11-11 18:26:02', '2026-11-13 09:37:02'),
(44, 44, 'FKU-20261111-9043-1', 838000.00, 0.00, 'J&T Express', 'YES', 'KMB-282-067', 'shipped', 'JT810000000044', '2026-11-11 16:09:02', '2026-11-12 18:22:02'),
(45, 45, 'FKU-20261111-9044-1', 1246000.00, 0.00, 'SiCepat', 'REG', 'KMB-502-008', 'shipped', 'SI810000000045', '2026-11-11 13:52:02', '2026-11-12 17:06:02'),
(46, 46, 'FKU-20261111-9045-1', 238000.00, 18000.00, 'AnterAja', 'REG', 'KMB-902-045', 'received', 'AN810000000046', '2026-11-11 11:35:02', '2026-11-13 07:33:02'),
(47, 47, 'FKU-20261111-9046-1', 328000.00, 0.00, 'Lion Parcel', 'REG', 'KMB-552-082', 'shipped', 'LI810000000047', '2026-11-11 09:18:02', '2026-11-12 14:36:02'),
(48, 48, 'FKU-20261111-9047-1', 706000.00, 0.00, 'JNE', 'JTR', 'KMB-831-023', 'shipped', 'JN810000000048', '2026-11-11 07:01:02', '2026-11-12 13:20:02'),
(49, 49, 'FKU-20261111-9048-1', 158000.00, 16000.00, 'JNE', 'REG', 'KMB-602-060', 'received', 'JN810000000049', '2026-11-11 04:44:02', '2026-11-13 05:30:02'),
(50, 50, 'FKU-20261111-9049-1', 298000.00, 42000.00, 'J&T Express', 'YES', 'KMB-1216', 'shipped', 'JT810000000050', '2026-11-11 02:27:02', '2026-11-12 10:50:02'),
(51, 51, 'FKU-20261111-9050-1', 1276000.00, 0.00, 'SiCepat', 'REG', 'KMB-612-038', 'received', 'SI810000000051', '2026-11-11 00:10:02', '2026-11-13 04:08:02'),
(52, 52, 'FKU-20261111-9051-1', 378000.00, 0.00, 'AnterAja', 'REG', 'KMB-114-075', 'received', 'AN810000000052', '2026-11-10 21:53:02', '2026-11-13 03:27:02'),
(53, 53, 'FKU-20261110-9052-1', 648000.00, 0.00, 'Lion Parcel', 'REG', 'KMB-805-016', 'completed', 'LI810000000053', '2026-11-10 02:24:02', '2026-11-13 12:00:02'),
(54, 54, 'FKU-20261110-9053-1', 1026000.00, 0.00, 'JNE', 'JTR', 'KMB-401-053', 'received', 'JN810000000054', '2026-11-09 20:53:02', '2026-11-12 19:57:02'),
(55, 55, 'FKU-20261109-9054-1', 998000.00, 0.00, 'JNE', 'REG', 'KMB-301-090', 'cancelled', NULL, '2026-11-09 15:22:02', '2026-11-10 23:29:02'),
(56, 56, 'FKU-20261109-9055-1', 398000.00, 0.00, 'J&T Express', 'YES', 'KMB-164-031', 'received', 'JT810000000056', '2026-11-09 09:51:02', '2026-11-12 16:38:02'),
(57, 57, 'FKU-20261109-9056-1', 1256000.00, 0.00, 'SiCepat', 'REG', 'KMB-351-068', 'completed', 'SI810000000057', '2026-11-09 04:20:02', '2026-11-13 08:41:02'),
(58, 58, 'FKU-20261109-9057-1', 578000.00, 0.00, 'AnterAja', 'REG', 'KMB-571-009', 'received', 'AN810000000058', '2026-11-08 22:49:02', '2026-11-12 13:20:02'),
(59, 59, 'FKU-20261109-9058-1', 538000.00, 0.00, 'Lion Parcel', 'REG', 'KMB-761-046', 'received', 'LI810000000059', '2026-11-08 17:18:02', '2026-11-12 11:40:02'),
(60, 60, 'FKU-20261108-9059-1', 1296000.00, 0.00, 'JNE', 'JTR', 'KMB-552-083', 'received', 'JN810000000060', '2026-11-08 11:47:02', '2026-11-12 10:01:02'),
(61, 61, 'FKU-20261108-9060-1', 458000.00, 0.00, 'JNE', 'REG', 'KMB-233-024', 'completed', 'JN810000000061', '2026-11-08 06:16:02', '2026-11-13 05:23:02'),
(62, 62, 'FKU-20261108-9061-1', 638000.00, 0.00, 'J&T Express', 'YES', 'KMB-651-061', 'received', 'JT810000000062', '2026-11-08 00:45:02', '2026-11-12 06:42:02'),
(63, 63, 'FKU-20261108-9062-1', 1146000.00, 0.00, 'SiCepat', 'REG', 'KMB-6024', 'received', 'SI810000000063', '2026-11-07 19:14:02', '2026-11-12 05:03:02'),
(64, 64, 'FKU-20261107-9063-1', 718000.00, 0.00, 'AnterAja', 'REG', 'KMB-802-039', 'received', 'AN810000000064', '2026-11-07 13:43:02', '2026-11-12 03:24:02'),
(65, 65, 'FKU-20261107-9064-1', 708000.00, 0.00, 'Lion Parcel', 'REG', 'KMB-401-076', 'completed', 'LI810000000065', '2026-11-07 08:12:02', '2026-11-13 02:04:02'),
(66, 66, 'FKU-20261107-9065-1', 1506000.00, 0.00, 'JNE', 'JTR', 'KMB-201-017', 'received', 'JN810000000066', '2026-11-07 02:41:02', '2026-11-12 00:05:02'),
(67, 67, 'FKU-20261107-9066-1', 1298000.00, 0.00, 'JNE', 'REG', 'KMB-171-054', 'completed', 'JN810000000067', '2026-11-06 21:10:02', '2026-11-13 00:25:02'),
(68, 68, 'FKU-20261106-9067-1', 838000.00, 0.00, 'J&T Express', 'YES', 'KMB-282-091', 'completed', 'JT810000000068', '2026-11-06 15:39:02', '2026-11-12 23:35:02'),
(69, 69, 'FKU-20261106-9068-1', 1246000.00, 0.00, 'SiCepat', 'REG', 'KMB-502-032', 'completed', 'SI810000000069', '2026-11-06 10:08:02', '2026-11-12 22:46:02'),
(70, 70, 'FKU-20261106-9069-1', 238000.00, 42000.00, 'AnterAja', 'REG', 'KMB-902-069', 'completed', 'AN810000000070', '2026-11-06 04:37:02', '2026-11-12 21:56:02'),
(71, 71, 'FKU-20261106-9070-1', 538000.00, 0.00, 'Lion Parcel', 'REG', 'KMB-552-010', 'completed', 'LI810000000071', '2026-11-05 23:06:02', '2026-11-12 21:06:02'),
(72, 72, 'FKU-20261106-9071-1', 1126000.00, 0.00, 'JNE', 'JTR', 'KMB-831-047', 'completed', 'JN810000000072', '2026-11-05 17:35:02', '2026-11-12 20:17:02'),
(73, 73, 'FKU-20261105-9072-1', 578000.00, 0.00, 'JNE', 'REG', 'KMB-602-084', 'completed', 'JN810000000073', '2026-11-05 12:04:02', '2026-11-12 19:27:02'),
(74, 74, 'FKU-20261105-9073-1', 508000.00, 0.00, 'J&T Express', 'YES', 'KMB-121-025', 'completed', 'JT810000000074', '2026-11-05 06:33:02', '2026-11-12 18:37:02'),
(75, 75, 'FKU-20261105-9074-1', 1486000.00, 0.00, 'SiCepat', 'REG', 'KMB-612-062', 'completed', 'SI810000000075', '2026-11-05 01:02:02', '2026-11-12 17:48:02'),
(76, 76, 'FKU-20261105-9075-1', 578000.00, 0.00, 'AnterAja', 'REG', 'KMB-8022', 'completed', 'AN810000000076', '2026-11-04 19:31:02', '2026-11-12 16:58:02'),
(77, 77, 'FKU-20261104-9076-1', 648000.00, 0.00, 'Lion Parcel', 'REG', 'KMB-805-040', 'completed', 'LI810000000077', '2026-11-04 14:00:02', '2026-11-12 16:08:02'),
(78, 78, 'FKU-20261104-9077-1', 1026000.00, 0.00, 'JNE', 'JTR', 'KMB-401-077', 'completed', 'JN810000000078', '2026-11-04 08:29:02', '2026-11-12 15:19:02'),
(79, 79, 'FKU-20261104-9078-1', 998000.00, 0.00, 'JNE', 'REG', 'KMB-301-018', 'completed', 'JN810000000079', '2026-11-04 02:58:02', '2026-11-12 14:29:02'),
(80, 80, 'FKU-20261104-9079-1', 398000.00, 0.00, 'J&T Express', 'YES', 'KMB-164-055', 'completed', 'JT810000000080', '2026-11-03 21:27:02', '2026-11-12 13:39:02'),
(81, 81, 'FKU-20261103-9080-1', 1256000.00, 0.00, 'SiCepat', 'REG', 'KMB-351-092', 'completed', 'SI810000000081', '2026-11-03 15:56:02', '2026-11-12 12:50:02'),
(82, 82, 'FKU-20261103-9081-1', 578000.00, 0.00, 'AnterAja', 'REG', 'KMB-571-033', 'cancelled', NULL, '2026-11-03 10:25:02', '2026-11-06 15:13:02'),
(83, 83, 'FKU-20261103-9082-1', 538000.00, 0.00, 'Lion Parcel', 'REG', 'KMB-761-070', 'completed', 'LI810000000083', '2026-11-03 04:54:02', '2026-11-12 11:11:02'),
(84, 84, 'FKU-20261103-9083-1', 1296000.00, 0.00, 'JNE', 'JTR', 'KMB-552-011', 'completed', 'JN810000000084', '2026-11-02 23:23:02', '2026-11-12 10:21:02'),
(85, 85, 'FKU-20261030-9084-1', 458000.00, 0.00, 'JNE', 'REG', 'KMB-233-048', 'completed', 'JN810000000085', '2026-10-30 02:24:02', '2026-11-11 20:24:02'),
(86, 86, 'FKU-20261029-9085-1', 638000.00, 0.00, 'J&T Express', 'YES', 'KMB-651-085', 'completed', 'JT810000000086', '2026-10-29 00:13:02', '2026-11-11 16:28:02'),
(87, 87, 'FKU-20261028-9086-1', 1146000.00, 0.00, 'SiCepat', 'REG', 'KMB-103-026', 'completed', 'SI810000000087', '2026-10-27 22:02:02', '2026-11-11 12:33:02'),
(88, 88, 'FKU-20261027-9087-1', 718000.00, 0.00, 'AnterAja', 'REG', 'KMB-802-063', 'completed', 'AN810000000088', '2026-10-26 19:51:02', '2026-11-11 08:37:02'),
(89, 89, 'FKU-20261026-9088-1', 708000.00, 0.00, 'Lion Parcel', 'REG', 'KMB-5528', 'completed', 'LI810000000089', '2026-10-25 17:40:02', '2026-11-11 04:41:02'),
(90, 90, 'FKU-20261024-9089-1', 1576000.00, 0.00, 'JNE', 'JTR', 'KMB-201-041', 'completed', 'JN810000000090', '2026-10-24 15:29:02', '2026-11-11 00:46:02'),
(91, 91, 'FKU-20261023-9090-1', 1298000.00, 0.00, 'JNE', 'REG', 'KMB-171-078', 'completed', 'JN810000000091', '2026-10-23 13:18:02', '2026-11-10 20:50:02'),
(92, 92, 'FKU-20261022-9091-1', 838000.00, 0.00, 'J&T Express', 'YES', 'KMB-282-019', 'completed', 'JT810000000092', '2026-10-22 11:07:02', '2026-11-10 16:54:02'),
(93, 93, 'FKU-20261021-9092-1', 1446000.00, 0.00, 'SiCepat', 'REG', 'KMB-502-056', 'completed', 'SI810000000093', '2026-10-21 08:56:02', '2026-11-10 12:59:02'),
(94, 94, 'FKU-20261020-9093-1', 238000.00, 36000.00, 'AnterAja', 'REG', 'KMB-902-093', 'completed', 'AN810000000094', '2026-10-20 06:45:02', '2026-11-10 09:03:02'),
(95, 95, 'FKU-20261019-9094-1', 708000.00, 0.00, 'Lion Parcel', 'REG', 'KMB-552-034', 'completed', 'LI810000000095', '2026-10-19 04:34:02', '2026-11-10 05:08:02'),
(96, 96, 'FKU-20261018-9095-1', 1546000.00, 0.00, 'JNE', 'JTR', 'KMB-831-071', 'completed', 'JN810000000096', '2026-10-18 02:23:02', '2026-11-10 01:12:02'),
(97, 97, 'FKU-20261017-9096-1', 858000.00, 0.00, 'JNE', 'REG', 'KMB-602-012', 'completed', 'JN810000000097', '2026-10-17 00:12:02', '2026-11-09 21:16:02'),
(98, 98, 'FKU-20261016-9097-1', 858000.00, 0.00, 'J&T Express', 'YES', 'KMB-121-049', 'completed', 'JT810000000098', '2026-10-15 22:01:02', '2026-11-09 17:21:02'),
(99, 99, 'FKU-20261015-9098-1', 1236000.00, 0.00, 'SiCepat', 'REG', 'KMB-612-086', 'completed', 'SI810000000099', '2026-10-14 19:50:02', '2026-11-09 13:25:02'),
(100, 100, 'FKU-20261014-9099-1', 638000.00, 0.00, 'AnterAja', 'REG', 'KMB-114-027', 'completed', 'AN810000000100', '2026-10-13 17:39:02', '2026-11-09 09:29:02'),
(101, 101, 'FKU-20261012-9100-1', 498000.00, 0.00, 'Lion Parcel', 'REG', 'KMB-805-064', 'completed', 'LI810000000101', '2026-10-12 15:28:02', '2026-11-09 05:34:02'),
(102, 102, 'FKU-20261011-9101-1', 896000.00, 0.00, 'JNE', 'JTR', 'KMB-401-005', 'completed', 'JN810000000102', '2026-10-11 13:17:02', '2026-11-09 01:38:02'),
(103, 103, 'FKU-20261010-9102-1', 658000.00, 0.00, 'JNE', 'REG', 'KMB-301-042', 'completed', 'JN810000000103', '2026-10-10 11:06:02', '2026-11-08 21:42:02'),
(104, 104, 'FKU-20261009-9103-1', 528000.00, 0.00, 'J&T Express', 'YES', 'KMB-164-079', 'completed', 'JT810000000104', '2026-10-09 08:55:02', '2026-11-08 17:47:02'),
(105, 105, 'FKU-20261008-9104-1', 1256000.00, 0.00, 'SiCepat', 'REG', 'KMB-351-020', 'completed', 'SI810000000105', '2026-10-08 06:44:02', '2026-11-08 13:51:02'),
(106, 106, 'FKU-20261007-9105-1', 578000.00, 0.00, 'AnterAja', 'REG', 'KMB-571-057', 'completed', 'AN810000000106', '2026-10-07 04:33:02', '2026-11-08 09:55:02'),
(107, 107, 'FKU-20261006-9106-1', 538000.00, 0.00, 'Lion Parcel', 'REG', 'KMB-761-094', 'completed', 'LI810000000107', '2026-10-06 02:22:02', '2026-11-08 06:00:02'),
(108, 108, 'FKU-20261005-9107-1', 1296000.00, 0.00, 'JNE', 'JTR', 'KMB-552-035', 'completed', 'JN810000000108', '2026-10-05 00:11:02', '2026-11-08 02:04:02'),
(109, 109, 'FKU-20261004-9108-1', 458000.00, 0.00, 'JNE', 'REG', 'KMB-233-072', 'cancelled', NULL, '2026-10-03 22:00:02', '2026-10-16 06:31:02'),
(110, 110, 'FKU-20261003-9109-1', 638000.00, 0.00, 'J&T Express', 'YES', 'KMB-651-013', 'completed', 'JT810000000110', '2026-10-02 19:49:02', '2026-11-07 18:13:02'),
(111, 111, 'FKU-20261002-9110-1', 1146000.00, 0.00, 'SiCepat', 'REG', 'KMB-103-050', 'completed', 'SI810000000111', '2026-10-01 17:38:02', '2026-11-07 14:17:02'),
(112, 112, 'FKU-20260930-9111-1', 718000.00, 0.00, 'AnterAja', 'REG', 'KMB-802-087', 'completed', 'AN810000000112', '2026-09-30 15:27:02', '2026-11-07 10:21:02'),
(113, 113, 'FKU-20260929-9112-1', 708000.00, 0.00, 'Lion Parcel', 'REG', 'KMB-401-028', 'completed', 'LI810000000113', '2026-09-29 13:16:02', '2026-11-07 06:26:02'),
(114, 114, 'FKU-20260928-9113-1', 1526000.00, 0.00, 'JNE', 'JTR', 'KMB-201-065', 'completed', 'JN810000000114', '2026-09-28 11:05:02', '2026-11-07 02:30:02'),
(115, 115, 'FKU-20260927-9114-1', 1298000.00, 0.00, 'JNE', 'REG', 'KMB-171-006', 'completed', 'JN810000000115', '2026-09-27 08:54:02', '2026-11-06 22:35:02'),
(116, 116, 'FKU-20260926-9115-1', 838000.00, 0.00, 'J&T Express', 'YES', 'KMB-282-043', 'completed', 'JT810000000116', '2026-09-26 06:43:02', '2026-11-06 18:39:02'),
(117, 117, 'FKU-20260925-9116-1', 1276000.00, 0.00, 'SiCepat', 'REG', 'KMB-502-080', 'completed', 'SI810000000117', '2026-09-25 04:32:02', '2026-11-06 14:43:02'),
(118, 118, 'FKU-20260924-9117-1', 238000.00, 30000.00, 'AnterAja', 'REG', 'KMB-902-021', 'completed', 'AN810000000118', '2026-09-24 02:21:02', '2026-11-06 10:48:02'),
(119, 119, 'FKU-20260923-9118-1', 598000.00, 0.00, 'Lion Parcel', 'REG', 'KMB-552-058', 'completed', 'LI810000000119', '2026-09-23 00:10:02', '2026-11-06 06:52:02'),
(120, 120, 'FKU-20260922-9119-1', 1166000.00, 0.00, 'JNE', 'JTR', 'KMB-831-095', 'completed', 'JN810000000120', '2026-09-21 21:59:02', '2026-11-06 02:56:02'),
(121, 121, 'FKU-20260921-9120-1', 718000.00, 0.00, 'JNE', 'REG', 'KMB-602-036', 'completed', 'JN810000000121', '2026-09-20 19:48:02', '2026-11-05 23:01:02'),
(122, 122, 'FKU-20260920-9121-1', 718000.00, 0.00, 'J&T Express', 'YES', 'KMB-121-073', 'completed', 'JT810000000122', '2026-09-19 17:37:02', '2026-11-05 19:05:02'),
(123, 123, 'FKU-20260918-9122-1', 796000.00, 0.00, 'SiCepat', 'REG', 'KMB-612-014', 'completed', 'SI810000000123', '2026-09-18 15:26:02', '2026-11-05 15:09:02'),
(124, 124, 'FKU-20260917-9123-1', 398000.00, 0.00, 'AnterAja', 'REG', 'KMB-114-051', 'completed', 'AN810000000124', '2026-09-17 13:15:02', '2026-11-05 11:14:02'),
(125, 125, 'FKU-20260916-9124-1', 398000.00, 0.00, 'Lion Parcel', 'REG', 'KMB-805-088', 'completed', 'LI810000000125', '2026-09-16 11:04:02', '2026-11-05 07:18:02'),
(126, 126, 'FKU-20260915-9125-1', 736000.00, 0.00, 'JNE', 'JTR', 'KMB-401-029', 'completed', 'JN810000000126', '2026-09-15 08:53:02', '2026-11-05 03:22:02'),
(127, 127, 'FKU-20260914-9126-1', 638000.00, 0.00, 'JNE', 'REG', 'KMB-301-066', 'completed', 'JN810000000127', '2026-09-14 06:42:02', '2026-11-04 23:27:02'),
(128, 128, 'FKU-20260913-9127-1', 518000.00, 0.00, 'J&T Express', 'YES', 'KMB-164-007', 'completed', 'JT810000000128', '2026-09-13 04:31:02', '2026-11-04 19:31:02'),
(129, 129, 'FKU-20260912-9128-1', 1056000.00, 0.00, 'SiCepat', 'REG', 'KMB-351-044', 'completed', 'SI810000000129', '2026-09-12 02:20:02', '2026-11-04 15:35:02'),
(130, 130, 'FKU-20260911-9129-1', 418000.00, 0.00, 'AnterAja', 'REG', 'KMB-571-081', 'completed', 'AN810000000130', '2026-09-11 00:09:02', '2026-11-04 11:40:02'),
(131, 131, 'FKU-20260910-9130-1', 398000.00, 0.00, 'Lion Parcel', 'REG', 'KMB-761-022', 'completed', 'LI810000000131', '2026-09-09 21:58:02', '2026-11-04 07:44:02'),
(132, 132, 'FKU-20260909-9131-1', 1196000.00, 0.00, 'JNE', 'JTR', 'KMB-552-059', 'completed', 'JN810000000132', '2026-09-08 19:47:02', '2026-11-04 03:48:02');

-- --------------------------------------------------------

--
-- Table structure for table `support_tickets`
--

CREATE TABLE `support_tickets` (
  `id` bigint UNSIGNED NOT NULL,
  `ticket_number` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_id` bigint UNSIGNED DEFAULT NULL,
  `category` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `priority` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'normal',
  `status` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'open',
  `assigned_to` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_replied_at` timestamp NULL DEFAULT NULL,
  `resolved_at` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_by` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `support_tickets`
--

INSERT INTO `support_tickets` (`id`, `ticket_number`, `user_id`, `order_id`, `category`, `subject`, `description`, `priority`, `status`, `assigned_to`, `last_replied_at`, `resolved_at`, `is_active`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'TKT-20261114-0001', '49be2788-69c8-d175-966e-a15bfc44a012', NULL, 'payment', 'QRIS sudah terpotong tapi pesanan belum masuk', 'Halo, saya bayar pakai QRIS sekitar 20 menit lalu. Saldo sudah terpotong Rp 329.000, tapi di halaman pesanan statusnya masih menunggu pembayaran. Mohon dicek ya.', 'urgent', 'open', NULL, NULL, NULL, 1, '49be2788-69c8-d175-966e-a15bfc44a012', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 02:00:37', '2026-11-14 02:00:37', NULL),
(2, 'TKT-20261114-0002', '306cd17b-c0d6-b1b1-cf06-11f5c3ebfabc', 1, 'order', 'Pesanan belum bergerak dari status diproses', 'Pesanan saya sudah dua hari masih \"diproses\". Rencana mau dipakai acara Sabtu, masih bisa dikirim hari ini?', 'high', 'in_progress', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 01:35:37', NULL, 1, '306cd17b-c0d6-b1b1-cf06-11f5c3ebfabc', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 00:49:37', '2026-11-14 01:35:37', NULL),
(3, 'TKT-20261114-0003', '581c734e-1148-d4a2-2ba7-f6d32cc31d0f', NULL, 'product', 'Ukuran kemeja linen oversize untuk tinggi 168 cm', 'Saya tinggi 168 cm, berat 62 kg. Lebih baik ambil size M atau L untuk kemeja linen oversize? Takut terlalu panjang di lengan.', 'normal', 'in_progress', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-13 23:51:37', NULL, 1, '581c734e-1148-d4a2-2ba7-f6d32cc31d0f', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-13 22:54:37', '2026-11-13 23:51:37', NULL),
(4, 'TKT-20261112-0004', '17aa9f53-81c1-7db5-a094-14b0cae5d4f2', 2, 'order', 'Minta tukar ukuran dress dari M ke L', 'Dress midi linen yang saya terima sedikit sempit di pinggang. Bisa tukar ke ukuran L? Label masih utuh dan belum saya pakai keluar.', 'normal', 'resolved', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-12 03:32:37', '2026-11-12 03:32:37', 1, '17aa9f53-81c1-7db5-a094-14b0cae5d4f2', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-12 02:24:37', '2026-11-12 03:32:37', NULL),
(5, 'TKT-20261113-0005', '49be2788-69c8-d175-966e-a15bfc44a012', NULL, 'store', 'Bisa kirim ke Singapura?', 'Saya mau kirim beberapa item ke saudara di Singapura. Apakah bisa dikirim ke luar negeri dan berapa estimasi ongkirnya?', 'low', 'open', NULL, NULL, NULL, 1, '49be2788-69c8-d175-966e-a15bfc44a012', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-13 02:24:37', '2026-11-13 02:24:37', NULL),
(6, 'TKT-20261108-0006', '581c734e-1148-d4a2-2ba7-f6d32cc31d0f', NULL, 'technical', 'Tidak bisa login setelah ganti nomor HP', 'Setelah ganti nomor HP, kode OTP tidak masuk ke nomor baru saya. Sudah coba kirim ulang tiga kali.', 'normal', 'closed', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-08 03:54:37', '2026-11-08 03:54:37', 1, '581c734e-1148-d4a2-2ba7-f6d32cc31d0f', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-08 02:24:37', '2026-11-08 03:54:37', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `support_ticket_messages`
--

CREATE TABLE `support_ticket_messages` (
  `id` bigint UNSIGNED NOT NULL,
  `ticket_id` bigint UNSIGNED NOT NULL,
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `attachments` json DEFAULT NULL,
  `is_internal` tinyint(1) NOT NULL DEFAULT '0',
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `support_ticket_messages`
--

INSERT INTO `support_ticket_messages` (`id`, `ticket_id`, `user_id`, `message`, `attachments`, `is_internal`, `read_at`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, '49be2788-69c8-d175-966e-a15bfc44a012', 'Halo, saya bayar pakai QRIS sekitar 20 menit lalu. Saldo sudah terpotong Rp 329.000, tapi di halaman pesanan statusnya masih menunggu pembayaran. Mohon dicek ya.', NULL, 0, '2026-11-14 02:02:37', '2026-11-14 02:00:37', '2026-11-14 02:00:37', NULL),
(2, 2, '306cd17b-c0d6-b1b1-cf06-11f5c3ebfabc', 'Pesanan saya sudah dua hari masih \"diproses\". Rencana mau dipakai acara Sabtu, masih bisa dikirim hari ini?', NULL, 0, '2026-11-14 00:51:37', '2026-11-14 00:49:37', '2026-11-14 00:49:37', NULL),
(3, 2, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'Pesanan sudah kami teruskan ke tim packing. Estimasi pickup kurir hari ini sebelum jam 17.00, nomor resi akan muncul di halaman pesanan.', NULL, 0, '2026-11-14 01:38:37', '2026-11-14 01:35:37', '2026-11-14 01:35:37', NULL),
(4, 2, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'Internal: stok varian warna hitam tinggal 2 pcs, tawarkan warna navy bila pembeli butuh cepat.', NULL, 1, NULL, '2026-11-14 01:39:37', '2026-11-14 01:39:37', NULL),
(5, 3, '581c734e-1148-d4a2-2ba7-f6d32cc31d0f', 'Saya tinggi 168 cm, berat 62 kg. Lebih baik ambil size M atau L untuk kemeja linen oversize? Takut terlalu panjang di lengan.', NULL, 0, '2026-11-13 22:56:37', '2026-11-13 22:54:37', '2026-11-13 22:54:37', NULL),
(6, 3, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'Untuk tinggi 168 cm, kami sarankan size M agar panjang lengan tidak berlebih. Kalau ingin lebih longgar, size L masih oke dengan potongan oversize.', NULL, 0, '2026-11-13 23:54:37', '2026-11-13 23:51:37', '2026-11-13 23:51:37', NULL),
(7, 4, '17aa9f53-81c1-7db5-a094-14b0cae5d4f2', 'Dress midi linen yang saya terima sedikit sempit di pinggang. Bisa tukar ke ukuran L? Label masih utuh dan belum saya pakai keluar.', NULL, 0, '2026-11-12 02:26:37', '2026-11-12 02:24:37', '2026-11-12 02:24:37', NULL),
(8, 4, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'Pesanan sudah kami teruskan ke tim packing. Estimasi pickup kurir hari ini sebelum jam 17.00, nomor resi akan muncul di halaman pesanan.', NULL, 0, '2026-11-12 03:35:37', '2026-11-12 03:32:37', '2026-11-12 03:32:37', NULL),
(9, 4, '17aa9f53-81c1-7db5-a094-14b0cae5d4f2', 'Sudah diterima dan sesuai, terima kasih bantuannya.', NULL, 0, '2026-11-12 03:52:37', '2026-11-12 03:50:37', '2026-11-12 03:50:37', NULL),
(10, 5, '49be2788-69c8-d175-966e-a15bfc44a012', 'Saya mau kirim beberapa item ke saudara di Singapura. Apakah bisa dikirim ke luar negeri dan berapa estimasi ongkirnya?', NULL, 0, '2026-11-13 02:26:37', '2026-11-13 02:24:37', '2026-11-13 02:24:37', NULL),
(11, 6, '581c734e-1148-d4a2-2ba7-f6d32cc31d0f', 'Setelah ganti nomor HP, kode OTP tidak masuk ke nomor baru saya. Sudah coba kirim ulang tiga kali.', NULL, 0, '2026-11-08 02:26:37', '2026-11-08 02:24:37', '2026-11-08 02:24:37', NULL),
(12, 6, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'Nomor HP sudah kami perbarui. Silakan coba kirim ulang kode OTP, jika masih tidak masuk hubungi kami lagi ya.', NULL, 0, '2026-11-08 03:57:37', '2026-11-08 03:54:37', '2026-11-08 03:54:37', NULL),
(13, 6, '581c734e-1148-d4a2-2ba7-f6d32cc31d0f', 'Sudah diterima dan sesuai, terima kasih bantuannya.', NULL, 0, '2026-11-08 04:14:37', '2026-11-08 04:12:37', '2026-11-08 04:12:37', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `firebase_uid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `has_set_password` tinyint(1) NOT NULL DEFAULT '0',
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_email_verified` tinyint(1) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `banned_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_by` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firebase_uid`, `email`, `password`, `has_set_password`, `name`, `avatar`, `is_email_verified`, `is_active`, `banned_at`, `remember_token`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
('0112d875-50e7-9f82-e3db-8b236203ae0c', NULL, 'rangga.pratama@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Rangga Pratama', 'https://randomuser.me/api/portraits/women/41.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-07-27 02:24:02', '2026-11-14 02:24:02', NULL),
('01e1e35a-187c-d961-58ca-25d230056614', NULL, 'nadia.kusuma@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Nadia Kusuma', 'https://randomuser.me/api/portraits/women/5.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-06-21 02:24:02', '2026-11-14 02:24:02', NULL),
('028f8278-dfa1-4d9d-a2fb-eddd26813921', NULL, 'prasetyo.adi@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Prasetyo Adi', 'https://randomuser.me/api/portraits/women/39.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-07-25 02:24:02', '2026-11-14 02:24:02', NULL),
('0375609e-4be7-9b63-2f6d-74fc64235a78', NULL, 'rafi@fashionku.id', '$2y$12$Hk7Vp1XYZCgLtSe3896Y3O3NZxwulrqU.AWaLHdTiubXG5iwIetkW', 1, 'Rafi Ardiansyah', 'https://picsum.photos/seed/7761d72823407d8a67caab0ac5ab5bb2/160/160', 1, 1, NULL, NULL, NULL, NULL, '2026-11-14 02:23:41', '2026-11-14 02:23:41', NULL),
('03d879fa-ea37-16e7-0382-d9e05bce0ea0', NULL, 'reza.fahlevi@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Reza Fahlevi', 'https://randomuser.me/api/portraits/men/14.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-06-30 02:24:02', '2026-11-14 02:24:02', NULL),
('05ae4bc5-19bf-91e6-d6d6-f78747261a7f', NULL, 'jessica.tanoto@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Jessica Tanoto', 'https://randomuser.me/api/portraits/women/33.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-07-19 02:24:02', '2026-11-14 02:24:02', NULL),
('0dc38b96-2c45-1fef-1143-7c08e97cf3cf', NULL, 'larasati.dewi@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Larasati Dewi', 'https://randomuser.me/api/portraits/women/35.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-07-21 02:24:02', '2026-11-14 02:24:02', NULL),
('0fa38f39-7c4b-b50a-4de5-5843c793c295', NULL, 'indra.kusuma@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Indra Kusuma', 'https://randomuser.me/api/portraits/women/7.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-08-12 02:24:02', '2026-11-14 02:24:02', NULL),
('17aa9f53-81c1-7db5-a094-14b0cae5d4f2', NULL, 'sinta@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Sinta Maharani', 'https://randomuser.me/api/portraits/women/1.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-06-17 02:24:02', '2026-11-14 02:24:02', NULL),
('1b27d6c4-11e9-13d0-67d2-810e998376cc', NULL, 'umi.kalsum@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Umi Kalsum', 'https://randomuser.me/api/portraits/women/19.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-08-24 02:24:02', '2026-11-14 02:24:02', NULL),
('1e269f2c-8386-1ef0-ff8e-1494bf3746a3', NULL, 'suhailah.rahman@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Suhailah Rahman', 'https://randomuser.me/api/portraits/men/42.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-09-16 02:24:02', '2026-11-14 02:24:02', NULL),
('20d503c5-6e99-eb51-0cbd-2725f7e2e876', NULL, 'fransiska.loi@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Fransiska Loi', 'https://randomuser.me/api/portraits/women/29.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-09-03 02:24:02', '2026-11-14 02:24:02', NULL),
('20fea1be-a8f1-ea19-daa2-891de5e06685', NULL, 'melati.anggraini@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Melati Anggraini', 'https://randomuser.me/api/portraits/women/9.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-06-25 02:24:02', '2026-11-14 02:24:02', NULL),
('266fa5bb-8cc7-149a-46d9-09d1f0c8fe90', NULL, 'ratna.sari@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Ratna Sari', 'https://randomuser.me/api/portraits/women/23.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-07-09 02:24:02', '2026-11-14 02:24:02', NULL),
('2c230d3d-c8f6-ebf9-80d8-9238d4f2941a', NULL, 'vino.bastian@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Vino Bastian', 'https://randomuser.me/api/portraits/women/45.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-07-31 02:24:02', '2026-11-14 02:24:02', NULL),
('2f5b0694-e364-f9bd-e445-034953d50131', NULL, 'eko.purnomo@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Eko Purnomo', 'https://randomuser.me/api/portraits/women/3.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-08-08 02:24:02', '2026-11-14 02:24:02', NULL),
('306cd17b-c0d6-b1b1-cf06-11f5c3ebfabc', NULL, 'bagus@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Bagus Wicaksono', 'https://randomuser.me/api/portraits/men/4.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-06-20 02:24:02', '2026-11-14 02:24:02', NULL),
('3221a57c-2610-e0e3-593c-6b7c8f444086', NULL, 'lidya.manurung@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Lidya Manurung', 'https://randomuser.me/api/portraits/women/35.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-09-09 02:24:02', '2026-11-14 02:24:02', NULL),
('32dc5cb6-dfa4-d861-17b7-16128391058c', NULL, 'fitri.handayani@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Fitri Handayani', 'https://randomuser.me/api/portraits/women/7.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-06-23 02:24:02', '2026-11-14 02:24:02', NULL),
('331429a9-ba63-a268-3e5d-49912a26b5df', NULL, 'zaskia.mecca@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Zaskia Mecca', 'https://randomuser.me/api/portraits/women/23.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-08-28 02:24:02', '2026-11-14 02:24:02', NULL),
('3321e0dd-e12f-8a1a-db98-d2bc759a8436', NULL, 'zahra.amelia@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Zahra Amelia', 'https://randomuser.me/api/portraits/men/48.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-08-03 02:24:02', '2026-11-14 02:24:02', NULL),
('3509673a-1d35-b0b9-594c-ff9f3e19b2a9', NULL, 'krisna.yudha@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Krisna Yudha', 'https://randomuser.me/api/portraits/women/9.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-08-14 02:24:02', '2026-11-14 02:24:02', NULL),
('36333497-c72b-06cc-4875-815d9af60356', NULL, 'cahyo.nugroho@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Cahyo Nugroho', 'https://randomuser.me/api/portraits/men/26.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-08-31 02:24:02', '2026-11-14 02:24:02', NULL),
('37fcb800-49bf-9dbf-c867-fc9d233699c1', NULL, 'putra.mahendra@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Putra Mahendra', 'https://randomuser.me/api/portraits/men/14.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-08-19 02:24:02', '2026-11-14 02:24:02', NULL),
('38a478fc-af46-dab9-a7f9-ebe250220e5c', NULL, 'oki.setiabudi@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Oki Setiabudi', 'https://randomuser.me/api/portraits/women/13.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-08-18 02:24:02', '2026-11-14 02:24:02', NULL),
('3b0b84b6-6ba3-0c40-a16d-a075b449aa0d', NULL, 'bimo.aditya@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Bimo Aditya', 'https://randomuser.me/api/portraits/men/18.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-07-04 02:24:02', '2026-11-14 02:24:02', NULL),
('3dbd1354-8f7a-40b0-6247-23fcd4c8f491', NULL, 'rahmat.hidayat@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Rahmat Hidayat', 'https://randomuser.me/api/portraits/women/41.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-09-15 02:24:02', '2026-11-14 02:24:02', NULL),
('487eb68d-0b76-e01a-b043-b572294cd606', NULL, 'bayu.firmansyah@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Bayu Firmansyah', 'https://randomuser.me/api/portraits/men/26.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-07-12 02:24:02', '2026-11-14 02:24:02', NULL),
('4920f24e-514f-e2cd-08c0-3adf50220e53', NULL, 'tegar.afandi@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Tegar Afandi', 'https://randomuser.me/api/portraits/women/43.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-07-29 02:24:02', '2026-11-14 02:24:02', NULL),
('4937a1c4-62c8-5d35-3433-527614265df0', NULL, 'hendra.wijaya@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Hendra Wijaya', 'https://randomuser.me/api/portraits/men/16.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-07-02 02:24:02', '2026-11-14 02:24:02', NULL),
('4999ee98-9d2f-16b5-4e45-782a5cbc2e18', NULL, 'wahyu.setiawan@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Wahyu Setiawan', 'https://randomuser.me/api/portraits/men/46.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-09-20 02:24:02', '2026-11-14 02:24:02', NULL),
('49be2788-69c8-d175-966e-a15bfc44a012', NULL, 'alya@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Alya Putri', 'https://randomuser.me/api/portraits/women/3.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-06-19 02:24:02', '2026-11-14 02:24:02', NULL),
('4a41bf20-08d0-3256-2da1-473d2df9332d', NULL, 'wulan.sari@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Wulan Sari', 'https://randomuser.me/api/portraits/men/46.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-08-01 02:24:02', '2026-11-14 02:24:02', NULL),
('4fe4a5a9-ca82-3950-aa71-8f06a919f0bf', NULL, 'qori.amalia@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Qori Amalia', 'https://randomuser.me/api/portraits/women/15.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-08-20 02:24:02', '2026-11-14 02:24:02', NULL),
('53c58789-9a09-c2a9-e0cd-c840a7530ddb', NULL, 'yoga.pranata@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Yoga Pranata', 'https://randomuser.me/api/portraits/women/47.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-08-02 02:24:02', '2026-11-14 02:24:02', NULL),
('5570cce1-49a1-d137-3658-ff2640f2c112', NULL, 'ahmad.fauzi@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Ahmad Fauzi', 'https://randomuser.me/api/portraits/men/24.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-08-29 02:24:02', '2026-11-14 02:24:02', NULL),
('568ac464-063b-302b-c6f0-9a384b93f540', NULL, 'qodratullah.hasan@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Qodratullah Hasan', 'https://randomuser.me/api/portraits/men/40.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-09-14 02:24:02', '2026-11-14 02:24:02', NULL),
('581c734e-1148-d4a2-2ba7-f6d32cc31d0f', NULL, 'dimas@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Dimas Prayoga', 'https://randomuser.me/api/portraits/men/2.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-06-18 02:24:02', '2026-11-14 02:24:02', NULL),
('5e73f21e-65ff-583e-b0b2-49790262bd99', NULL, 'tomi.gunawan@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Tomi Gunawan', 'https://randomuser.me/api/portraits/men/18.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-08-23 02:24:02', '2026-11-14 02:24:02', NULL),
('62846adc-59a0-1459-ca7b-6d67b7cb98bb', NULL, 'verdiansyah.putra@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Verdiansyah Putra', 'https://randomuser.me/api/portraits/men/20.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-08-25 02:24:02', '2026-11-14 02:24:02', NULL),
('6523275d-f48d-41a5-0d49-72d139ce2711', NULL, 'kevin.santoso@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Kevin Santoso', 'https://randomuser.me/api/portraits/men/34.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-07-20 02:24:02', '2026-11-14 02:24:02', NULL),
('68cea60f-963e-3cf9-2f5d-579d2cffe41b', NULL, 'yusril.hakim@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Yusril Hakim', 'https://randomuser.me/api/portraits/men/22.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-08-27 02:24:02', '2026-11-14 02:24:02', NULL),
('6fbb8c86-9231-b8a1-88d3-646663652350', NULL, 'qonita.rahma@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Qonita Rahma', 'https://randomuser.me/api/portraits/men/40.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-07-26 02:24:02', '2026-11-14 02:24:02', NULL),
('74266d05-6397-1296-991e-3d76c6ad9122', NULL, 'iqbal.mauludi@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Iqbal Mauludi', 'https://randomuser.me/api/portraits/men/32.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-09-06 02:24:02', '2026-11-14 02:24:02', NULL),
('74e3c558-0560-b63b-ba00-8a01fc6af72a', NULL, 'sinta.dewanti@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Sinta Dewanti', 'https://randomuser.me/api/portraits/women/17.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-08-22 02:24:02', '2026-11-14 02:24:02', NULL),
('76fe5857-9fc0-e31b-449f-0ec9892d2459', NULL, 'lestari.ningsih@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Lestari Ningsih', 'https://randomuser.me/api/portraits/men/10.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-08-15 02:24:02', '2026-11-14 02:24:02', NULL),
('777afe4c-4837-d716-a13c-846e9cd8cd7a', NULL, 'winda.kartika@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Winda Kartika', 'https://randomuser.me/api/portraits/women/21.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-08-26 02:24:02', '2026-11-14 02:24:02', NULL),
('7bdd6f0a-3f48-e6e8-ee16-ec8e84ff19ca', NULL, 'hesti.puspitasari@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Hesti Puspitasari', 'https://randomuser.me/api/portraits/men/6.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-08-11 02:24:02', '2026-11-14 02:24:02', NULL),
('7c5ee92d-2adf-4963-9a6e-9dc1ff30be6f', 'SJnUc0cJXjbBetHXvSrYicmXfXA2', 'akbarfahlevy39@gmail.com', '$2y$12$VDtPJi2lMSHycf11Q63oYuIf0GcHJHgOwDyJZ8hyDVgWjsT2mPpKi', 0, 'Mochammad Rachman Akbar Fahlevy', 'https://lh3.googleusercontent.com/a/ACg8ocLwIcW9YpN2423z6G110ndWsC_stH2vC89ST117X1UV-w1l_Q=s96-c', 1, 1, NULL, NULL, NULL, NULL, '2026-11-14 04:00:37', '2026-11-14 04:00:37', NULL),
('8234251c-184e-4d14-e02b-63b6b5869842', NULL, 'jihan.aurelia@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Jihan Aurelia', 'https://randomuser.me/api/portraits/men/8.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-08-13 02:24:02', '2026-11-14 02:24:02', NULL),
('83981746-29d9-2a4e-4c3d-45ae19bcb789', NULL, 'erlangga.putra@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Erlangga Putra', 'https://randomuser.me/api/portraits/men/28.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-09-02 02:24:02', '2026-11-14 02:24:02', NULL),
('83fcef72-cc4f-747a-ee98-7ca1bbda04f9', NULL, 'nabila.syakira@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Nabila Syakira', 'https://randomuser.me/api/portraits/women/21.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-07-07 02:24:02', '2026-11-14 02:24:02', NULL),
('8422156d-3226-4379-1db3-86d8a6f18a5e', NULL, 'vina.oktaviani@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Vina Oktaviani', 'https://randomuser.me/api/portraits/women/25.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-07-11 02:24:02', '2026-11-14 02:24:02', NULL),
('847439d3-e0dd-ae2f-0ee8-9a07860386bd', NULL, 'ujang.suryana@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Ujang Suryana', 'https://randomuser.me/api/portraits/men/44.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-09-18 02:24:02', '2026-11-14 02:24:02', NULL),
('865931e8-2cc7-befe-d1a4-40f2184e8564', NULL, 'kemal.ataturk@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Kemal Ataturk', 'https://randomuser.me/api/portraits/men/34.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-09-08 02:24:02', '2026-11-14 02:24:02', NULL),
('8769c09a-cfd0-0292-f0c8-30b58bf4f1d5', NULL, 'muhammad.rizki@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Muhammad Rizki', 'https://randomuser.me/api/portraits/men/36.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-07-22 02:24:02', '2026-11-14 02:24:02', NULL),
('87ee7bc6-865f-4f03-f910-a1d267178717', NULL, 'clara.simanjuntak@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Clara Simanjuntak', 'https://randomuser.me/api/portraits/women/17.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-07-03 02:24:02', '2026-11-14 02:24:02', NULL),
('89a52d76-3cfc-c24c-cb98-21a4a56adbda', NULL, 'maulana.yusuf@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Maulana Yusuf', 'https://randomuser.me/api/portraits/men/36.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-09-10 02:24:02', '2026-11-14 02:24:02', NULL),
('8c0d42e6-e169-f777-614c-4c86da4b386d', NULL, 'irfan.hakim@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Irfan Hakim', 'https://randomuser.me/api/portraits/men/32.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-07-18 02:24:02', '2026-11-14 02:24:02', NULL),
('8f90ee9c-9303-a25d-6d77-f711e7ef84e6', NULL, 'donny.saputra@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Donny Saputra', 'https://randomuser.me/api/portraits/men/28.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-07-14 02:24:02', '2026-11-14 02:24:02', NULL),
('97cec183-eea2-5e70-1751-2819621fdbf2', NULL, 'rizky.pratama@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Rizky Pratama', 'https://randomuser.me/api/portraits/men/6.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-06-22 02:24:02', '2026-11-14 02:24:02', NULL),
('a59b13c6-da0d-cc36-aa08-7fdb038f3e7a', NULL, 'eka.puspita@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Eka Puspita', 'https://randomuser.me/api/portraits/women/29.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-07-15 02:24:02', '2026-11-14 02:24:02', NULL),
('a61ecb87-2715-a57d-a602-f41571558b3e', NULL, 'juwita.sari@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Juwita Sari', 'https://randomuser.me/api/portraits/women/33.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-09-07 02:24:02', '2026-11-14 02:24:02', NULL),
('a83143c9-3367-62a4-1a5c-d250674a1646', NULL, 'sari.wulandari@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Sari Wulandari', 'https://randomuser.me/api/portraits/women/19.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-07-05 02:24:02', '2026-11-14 02:24:02', NULL),
('ab398d16-9f7d-2929-aa2b-13f81d78d085', NULL, 'chandra.wijaya@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Chandra Wijaya', 'https://randomuser.me/api/portraits/women/1.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-08-06 02:24:02', '2026-11-14 02:24:02', NULL),
('abe56782-bb24-c759-25f7-e09751e8d336', NULL, 'fajar.nugroho@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Fajar Nugroho', 'https://randomuser.me/api/portraits/men/12.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-06-28 02:24:02', '2026-11-14 02:24:02', NULL),
('accc1906-fb5d-6efc-24ed-0e0fb269c69e', NULL, 'gilang.ramadhan@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Gilang Ramadhan', 'https://randomuser.me/api/portraits/men/30.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-07-16 02:24:02', '2026-11-14 02:24:02', NULL),
('adae9f8e-378d-b2a2-3122-70eb31a99996', NULL, 'sylvia.handoko@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Sylvia Handoko', 'https://randomuser.me/api/portraits/men/42.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-07-28 02:24:02', '2026-11-14 02:24:02', NULL),
('b1bd0bd7-5142-a51a-9155-576acb2bc84e', NULL, 'hilda.yuliani@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Hilda Yuliani', 'https://randomuser.me/api/portraits/women/31.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-09-05 02:24:02', '2026-11-14 02:24:02', NULL),
('b430a205-e6c4-f1a2-dd01-89b5c8728d3f', NULL, 'rian.adinata@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Rian Adinata', 'https://randomuser.me/api/portraits/men/16.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-08-21 02:24:02', '2026-11-14 02:24:02', NULL),
('b4844148-08c8-975a-6f83-f4eddd7fa28a', NULL, 'putri.ayu.lestari@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Putri Ayu Lestari', 'https://randomuser.me/api/portraits/women/15.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-07-01 02:24:02', '2026-11-14 02:24:02', NULL),
('be1f7f6c-786f-886f-70fd-1adf76c06110', NULL, 'gading.martadinata@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Gading Martadinata', 'https://randomuser.me/api/portraits/men/30.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-09-04 02:24:02', '2026-11-14 02:24:02', NULL),
('bf03fbce-d1d2-7300-136d-f61e4acdbe91', NULL, 'galih.prakoso@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Galih Prakoso', 'https://randomuser.me/api/portraits/women/5.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-08-10 02:24:02', '2026-11-14 02:24:02', NULL),
('c0d89002-20de-8855-3335-a6eb7ec4038f', NULL, 'dian.purnamasari@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Dian Purnamasari', 'https://randomuser.me/api/portraits/women/27.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-09-01 02:24:02', '2026-11-14 02:24:02', NULL),
('c323571d-d64c-f97c-2808-140d3610f2eb', NULL, 'aditya.nugraha@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Aditya Nugraha', 'https://randomuser.me/api/portraits/women/49.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-08-04 02:24:02', '2026-11-14 02:24:02', NULL),
('c5d9f141-2619-5ce4-055c-a13b1b030640', NULL, 'novi.andriani@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Novi Andriani', 'https://randomuser.me/api/portraits/women/37.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-09-11 02:24:02', '2026-11-14 02:24:02', NULL),
('c867f90f-7824-10fe-2aa3-2359ffe920a3', NULL, 'farah.nabila@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Farah Nabila', 'https://randomuser.me/api/portraits/men/4.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-08-09 02:24:02', '2026-11-14 02:24:02', NULL),
('c9858af3-80a2-1b07-293a-da94c650ac94', NULL, 'citra.kirana@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Citra Kirana', 'https://randomuser.me/api/portraits/women/27.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-07-13 02:24:02', '2026-11-14 02:24:02', NULL),
('cb8dbbb2-6e48-067a-4c9e-e8cfd2d385cb', NULL, 'hana.safitri@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Hana Safitri', 'https://randomuser.me/api/portraits/women/31.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-07-17 02:24:02', '2026-11-14 02:24:02', NULL),
('cf1106a3-b582-6454-caed-c4b9d720bdcd', NULL, 'brigita.sitorus@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Brigita Sitorus', 'https://randomuser.me/api/portraits/women/25.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-08-30 02:24:02', '2026-11-14 02:24:02', NULL),
('d1158e10-1fb5-8d0b-7ab2-b5ad00354462', NULL, 'intan.permata@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Intan Permata', 'https://randomuser.me/api/portraits/women/13.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-06-29 02:24:02', '2026-11-14 02:24:02', NULL),
('d6279585-7e9d-a7d9-50b8-d20071ff20d5', NULL, 'nadya.salsabila@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Nadya Salsabila', 'https://randomuser.me/api/portraits/men/12.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-08-17 02:24:02', '2026-11-14 02:24:02', NULL),
('d741cf38-85e7-6fdc-bfb4-e9f01fa0ac4a', NULL, 'yoga.saputra@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Yoga Saputra', 'https://randomuser.me/api/portraits/men/10.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-06-26 02:24:02', '2026-11-14 02:24:02', NULL),
('dc41400c-122c-90f0-d943-48a55f6f9abd', NULL, 'taufik.hidayat@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Taufik Hidayat', 'https://randomuser.me/api/portraits/men/20.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-07-06 02:24:02', '2026-11-14 02:24:02', NULL),
('dcaf3e0f-c3e0-3dd6-e158-cca1ec2560ad', NULL, 'opan.sofyan@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Opan Sofyan', 'https://randomuser.me/api/portraits/men/38.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-09-12 02:24:02', '2026-11-14 02:24:02', NULL),
('dcf53c7b-7960-20e7-e37b-ce04efcd9d31', NULL, 'vera.marlina@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Vera Marlina', 'https://randomuser.me/api/portraits/women/45.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-09-19 02:24:02', '2026-11-14 02:24:02', NULL),
('dd1ecb58-65a6-92bf-dd73-2f17941c977b', NULL, 'andi.kurniawan@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Andi Kurniawan', 'https://randomuser.me/api/portraits/men/22.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-07-08 02:24:02', '2026-11-14 02:24:02', NULL),
('ddc8ad23-f5d1-dbc4-0919-7a0eb049e67c', NULL, 'dinda.larasati@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Dinda Larasati', 'https://randomuser.me/api/portraits/men/2.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-08-07 02:24:02', '2026-11-14 02:24:02', NULL),
('dee09934-26d8-29d8-36e1-1781d5de4a77', NULL, 'dewi.lestari@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Dewi Lestari', 'https://randomuser.me/api/portraits/women/11.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-06-27 02:24:02', '2026-11-14 02:24:02', NULL),
('dff1ab85-91bd-f4a1-f36c-a62f6c2ce82e', NULL, 'puspita.ayu@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Puspita Ayu', 'https://randomuser.me/api/portraits/women/39.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-09-13 02:24:02', '2026-11-14 02:24:02', NULL),
('e237eb66-fa74-3577-7aed-437a8db49b60', NULL, 'oscar.simbolon@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Oscar Simbolon', 'https://randomuser.me/api/portraits/men/38.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-07-24 02:24:02', '2026-11-14 02:24:02', NULL),
('e61c80b0-3705-187e-58b5-70d1edb6ed8f', NULL, 'teguh.santoso@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Teguh Santoso', 'https://randomuser.me/api/portraits/women/43.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-09-17 02:24:02', '2026-11-14 02:24:02', NULL),
('e770f616-1223-c4da-de7b-e82721d80c40', NULL, 'arif.setiawan@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Arif Setiawan', 'https://randomuser.me/api/portraits/men/8.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-06-24 02:24:02', '2026-11-14 02:24:02', NULL),
('ea469813-e902-00b9-1bf4-a15e254ce82d', NULL, 'nadia@fashionku.id', '$2y$12$AoQT9Ce5DjZuKECojGBIJOEADArVsZVFHeT6ey5A248uJdvh0NtCW', 1, 'Nadia Prameswari', 'https://picsum.photos/seed/52b1f4035f07c40b4e1bb9e4f3a1cd53/160/160', 1, 1, NULL, NULL, NULL, NULL, '2026-11-14 02:23:41', '2026-11-14 02:23:41', NULL),
('eb50c71c-58bf-77e2-f3b9-920c25108c95', NULL, 'ulfa.nurlaila@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Ulfa Nurlaila', 'https://randomuser.me/api/portraits/men/44.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-07-30 02:24:02', '2026-11-14 02:24:02', NULL),
('ecb48677-ccbf-7d3d-76fd-8944218e0781', NULL, 'ilham.maulana@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Ilham Maulana', 'https://randomuser.me/api/portraits/men/24.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-07-10 02:24:02', '2026-11-14 02:24:02', NULL),
('fb22fb2e-476d-d51c-8f73-08aa30e70f4b', NULL, 'miko.alfandi@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Miko Alfandi', 'https://randomuser.me/api/portraits/women/11.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-08-16 02:24:02', '2026-11-14 02:24:02', NULL),
('fb358165-f121-342b-620b-53a635217b97', NULL, 'bella.anindita@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Bella Anindita', 'https://randomuser.me/api/portraits/men/50.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-08-05 02:24:02', '2026-11-14 02:24:02', NULL),
('fd1a4098-c0e9-2f33-f52d-b2b92cef814c', NULL, 'nina.marlina@gmail.com', '$2y$12$hvsD42t2Dh6HNmSyharP/unwusrRav8aznBzuEiW0LUZ25gZRVRoa', 1, 'Nina Marlina', 'https://randomuser.me/api/portraits/women/37.jpg', 1, 1, NULL, NULL, NULL, NULL, '2026-07-23 02:24:02', '2026-11-14 02:24:02', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_devices`
--

CREATE TABLE `user_devices` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `device_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `device_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `browser` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `browser_version` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `os` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `os_version` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sanctum_token_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sanctum_token_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_active_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `status` enum('active','inactive','revoked','expired') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `metadata` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`user_id`, `role_id`, `created_at`, `updated_at`) VALUES
('0112d875-50e7-9f82-e3db-8b236203ae0c', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('01e1e35a-187c-d961-58ca-25d230056614', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('028f8278-dfa1-4d9d-a2fb-eddd26813921', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('0375609e-4be7-9b63-2f6d-74fc64235a78', 1, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
('03d879fa-ea37-16e7-0382-d9e05bce0ea0', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('05ae4bc5-19bf-91e6-d6d6-f78747261a7f', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('0dc38b96-2c45-1fef-1143-7c08e97cf3cf', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('0fa38f39-7c4b-b50a-4de5-5843c793c295', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('17aa9f53-81c1-7db5-a094-14b0cae5d4f2', 2, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
('1b27d6c4-11e9-13d0-67d2-810e998376cc', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('1e269f2c-8386-1ef0-ff8e-1494bf3746a3', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('20d503c5-6e99-eb51-0cbd-2725f7e2e876', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('20fea1be-a8f1-ea19-daa2-891de5e06685', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('266fa5bb-8cc7-149a-46d9-09d1f0c8fe90', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('2c230d3d-c8f6-ebf9-80d8-9238d4f2941a', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('2f5b0694-e364-f9bd-e445-034953d50131', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('306cd17b-c0d6-b1b1-cf06-11f5c3ebfabc', 2, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
('3221a57c-2610-e0e3-593c-6b7c8f444086', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('32dc5cb6-dfa4-d861-17b7-16128391058c', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('331429a9-ba63-a268-3e5d-49912a26b5df', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('3321e0dd-e12f-8a1a-db98-d2bc759a8436', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('3509673a-1d35-b0b9-594c-ff9f3e19b2a9', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('36333497-c72b-06cc-4875-815d9af60356', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('37fcb800-49bf-9dbf-c867-fc9d233699c1', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('38a478fc-af46-dab9-a7f9-ebe250220e5c', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('3b0b84b6-6ba3-0c40-a16d-a075b449aa0d', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('3dbd1354-8f7a-40b0-6247-23fcd4c8f491', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('487eb68d-0b76-e01a-b043-b572294cd606', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('4920f24e-514f-e2cd-08c0-3adf50220e53', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('4937a1c4-62c8-5d35-3433-527614265df0', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('4999ee98-9d2f-16b5-4e45-782a5cbc2e18', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('49be2788-69c8-d175-966e-a15bfc44a012', 2, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
('4a41bf20-08d0-3256-2da1-473d2df9332d', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('4fe4a5a9-ca82-3950-aa71-8f06a919f0bf', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('53c58789-9a09-c2a9-e0cd-c840a7530ddb', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('5570cce1-49a1-d137-3658-ff2640f2c112', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('568ac464-063b-302b-c6f0-9a384b93f540', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('581c734e-1148-d4a2-2ba7-f6d32cc31d0f', 2, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
('5e73f21e-65ff-583e-b0b2-49790262bd99', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('62846adc-59a0-1459-ca7b-6d67b7cb98bb', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('6523275d-f48d-41a5-0d49-72d139ce2711', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('68cea60f-963e-3cf9-2f5d-579d2cffe41b', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('6fbb8c86-9231-b8a1-88d3-646663652350', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('74266d05-6397-1296-991e-3d76c6ad9122', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('74e3c558-0560-b63b-ba00-8a01fc6af72a', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('76fe5857-9fc0-e31b-449f-0ec9892d2459', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('777afe4c-4837-d716-a13c-846e9cd8cd7a', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('7bdd6f0a-3f48-e6e8-ee16-ec8e84ff19ca', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('7c5ee92d-2adf-4963-9a6e-9dc1ff30be6f', 2, '2026-11-14 04:01:42', '2026-11-14 04:01:42'),
('8234251c-184e-4d14-e02b-63b6b5869842', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('83981746-29d9-2a4e-4c3d-45ae19bcb789', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('83fcef72-cc4f-747a-ee98-7ca1bbda04f9', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('8422156d-3226-4379-1db3-86d8a6f18a5e', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('847439d3-e0dd-ae2f-0ee8-9a07860386bd', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('865931e8-2cc7-befe-d1a4-40f2184e8564', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('8769c09a-cfd0-0292-f0c8-30b58bf4f1d5', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('87ee7bc6-865f-4f03-f910-a1d267178717', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('89a52d76-3cfc-c24c-cb98-21a4a56adbda', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('8c0d42e6-e169-f777-614c-4c86da4b386d', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('8f90ee9c-9303-a25d-6d77-f711e7ef84e6', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('97cec183-eea2-5e70-1751-2819621fdbf2', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('a59b13c6-da0d-cc36-aa08-7fdb038f3e7a', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('a61ecb87-2715-a57d-a602-f41571558b3e', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('a83143c9-3367-62a4-1a5c-d250674a1646', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('ab398d16-9f7d-2929-aa2b-13f81d78d085', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('abe56782-bb24-c759-25f7-e09751e8d336', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('accc1906-fb5d-6efc-24ed-0e0fb269c69e', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('adae9f8e-378d-b2a2-3122-70eb31a99996', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('b1bd0bd7-5142-a51a-9155-576acb2bc84e', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('b430a205-e6c4-f1a2-dd01-89b5c8728d3f', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('b4844148-08c8-975a-6f83-f4eddd7fa28a', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('be1f7f6c-786f-886f-70fd-1adf76c06110', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('bf03fbce-d1d2-7300-136d-f61e4acdbe91', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('c0d89002-20de-8855-3335-a6eb7ec4038f', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('c323571d-d64c-f97c-2808-140d3610f2eb', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('c5d9f141-2619-5ce4-055c-a13b1b030640', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('c867f90f-7824-10fe-2aa3-2359ffe920a3', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('c9858af3-80a2-1b07-293a-da94c650ac94', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('cb8dbbb2-6e48-067a-4c9e-e8cfd2d385cb', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('cf1106a3-b582-6454-caed-c4b9d720bdcd', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('d1158e10-1fb5-8d0b-7ab2-b5ad00354462', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('d6279585-7e9d-a7d9-50b8-d20071ff20d5', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('d741cf38-85e7-6fdc-bfb4-e9f01fa0ac4a', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('dc41400c-122c-90f0-d943-48a55f6f9abd', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('dcaf3e0f-c3e0-3dd6-e158-cca1ec2560ad', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('dcf53c7b-7960-20e7-e37b-ce04efcd9d31', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('dd1ecb58-65a6-92bf-dd73-2f17941c977b', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('ddc8ad23-f5d1-dbc4-0919-7a0eb049e67c', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('dee09934-26d8-29d8-36e1-1781d5de4a77', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('dff1ab85-91bd-f4a1-f36c-a62f6c2ce82e', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('e237eb66-fa74-3577-7aed-437a8db49b60', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('e61c80b0-3705-187e-58b5-70d1edb6ed8f', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('e770f616-1223-c4da-de7b-e82721d80c40', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('ea469813-e902-00b9-1bf4-a15e254ce82d', 1, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
('ea469813-e902-00b9-1bf4-a15e254ce82d', 2, '2026-11-14 02:23:41', '2026-11-14 02:23:41'),
('eb50c71c-58bf-77e2-f3b9-920c25108c95', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('ecb48677-ccbf-7d3d-76fd-8944218e0781', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('fb22fb2e-476d-d51c-8f73-08aa30e70f4b', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('fb358165-f121-342b-620b-53a635217b97', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02'),
('fd1a4098-c0e9-2f33-f52d-b2b92cef814c', 2, '2026-11-14 02:24:02', '2026-11-14 02:24:02');

-- --------------------------------------------------------

--
-- Table structure for table `user_vouchers`
--

CREATE TABLE `user_vouchers` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `voucher_id` bigint UNSIGNED NOT NULL,
  `source_type` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `source_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'available',
  `claimed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `used_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_vouchers`
--

INSERT INTO `user_vouchers` (`id`, `user_id`, `voucher_id`, `source_type`, `source_id`, `status`, `claimed_at`, `used_at`, `created_at`, `updated_at`) VALUES
(1, 'adae9f8e-378d-b2a2-3122-70eb31a99996', 7, 'order', '7', 'used', '2026-11-14 01:13:02', '2026-11-14 01:18:02', '2026-11-14 01:13:02', '2026-11-14 01:18:02'),
(2, '68cea60f-963e-3cf9-2f5d-579d2cffe41b', 6, 'order', '13', 'used', '2026-11-13 23:14:02', '2026-11-13 23:19:02', '2026-11-13 23:14:02', '2026-11-13 23:19:02'),
(3, '97cec183-eea2-5e70-1751-2819621fdbf2', 3, 'order', '19', 'used', '2026-11-13 18:29:02', '2026-11-13 18:34:02', '2026-11-13 18:29:02', '2026-11-13 18:34:02'),
(4, '8769c09a-cfd0-0292-f0c8-30b58bf4f1d5', 1, 'order', '25', 'used', '2026-11-13 10:19:02', '2026-11-13 10:24:02', '2026-11-13 10:19:02', '2026-11-13 10:24:02'),
(5, 'b430a205-e6c4-f1a2-dd01-89b5c8728d3f', 7, 'order', '31', 'used', '2026-11-12 21:45:02', '2026-11-12 21:50:02', '2026-11-12 21:45:02', '2026-11-12 21:50:02'),
(6, '4999ee98-9d2f-16b5-4e45-782a5cbc2e18', 2, 'order', '37', 'used', '2026-11-12 08:03:02', '2026-11-12 08:08:02', '2026-11-12 08:03:02', '2026-11-12 08:08:02'),
(7, 'accc1906-fb5d-6efc-24ed-0e0fb269c69e', 3, 'order', '43', 'used', '2026-11-11 18:21:02', '2026-11-11 18:26:02', '2026-11-11 18:21:02', '2026-11-11 18:26:02'),
(8, '76fe5857-9fc0-e31b-449f-0ec9892d2459', 2, 'order', '49', 'used', '2026-11-11 04:39:02', '2026-11-11 04:44:02', '2026-11-11 04:39:02', '2026-11-11 04:44:02'),
(9, 'ecb48677-ccbf-7d3d-76fd-8944218e0781', 5, 'order', '61', 'used', '2026-11-08 06:11:02', '2026-11-08 06:16:02', '2026-11-08 06:11:02', '2026-11-08 06:16:02'),
(10, 'c867f90f-7824-10fe-2aa3-2359ffe920a3', 3, 'order', '67', 'used', '2026-11-06 21:05:02', '2026-11-06 21:10:02', '2026-11-06 21:05:02', '2026-11-06 21:10:02'),
(11, '865931e8-2cc7-befe-d1a4-40f2184e8564', 3, 'order', '73', 'used', '2026-11-05 11:59:02', '2026-11-05 12:04:02', '2026-11-05 11:59:02', '2026-11-05 12:04:02'),
(12, '3b0b84b6-6ba3-0c40-a16d-a075b449aa0d', 7, 'order', '79', 'used', '2026-11-04 02:53:02', '2026-11-04 02:58:02', '2026-11-04 02:53:02', '2026-11-04 02:58:02'),
(13, '3321e0dd-e12f-8a1a-db98-d2bc759a8436', 1, 'order', '85', 'used', '2026-10-30 02:19:02', '2026-10-30 02:24:02', '2026-10-30 02:19:02', '2026-10-30 02:24:02'),
(14, '83981746-29d9-2a4e-4c3d-45ae19bcb789', 3, 'order', '91', 'used', '2026-10-23 13:13:02', '2026-10-23 13:18:02', '2026-10-23 13:13:02', '2026-10-23 13:18:02'),
(15, 'abe56782-bb24-c759-25f7-e09751e8d336', 1, 'order', '97', 'used', '2026-10-17 00:07:02', '2026-10-17 00:12:02', '2026-10-17 00:07:02', '2026-10-17 00:12:02'),
(16, 'adae9f8e-378d-b2a2-3122-70eb31a99996', 7, 'order', '103', 'used', '2026-10-10 11:01:02', '2026-10-10 11:06:02', '2026-10-10 11:01:02', '2026-10-10 11:06:02'),
(17, '97cec183-eea2-5e70-1751-2819621fdbf2', 3, 'order', '115', 'used', '2026-09-27 08:49:02', '2026-09-27 08:54:02', '2026-09-27 08:49:02', '2026-09-27 08:54:02'),
(18, '8769c09a-cfd0-0292-f0c8-30b58bf4f1d5', 1, 'order', '121', 'used', '2026-09-20 19:43:02', '2026-09-20 19:48:02', '2026-09-20 19:43:02', '2026-09-20 19:48:02'),
(19, 'b430a205-e6c4-f1a2-dd01-89b5c8728d3f', 7, 'order', '127', 'used', '2026-09-14 06:37:02', '2026-09-14 06:42:02', '2026-09-14 06:37:02', '2026-09-14 06:42:02'),
(20, '17aa9f53-81c1-7db5-a094-14b0cae5d4f2', 1, 'promotion', 'seed-campaign-1', 'available', '2026-11-12 02:24:02', NULL, '2026-11-12 02:24:02', '2026-11-12 02:24:02'),
(21, '306cd17b-c0d6-b1b1-cf06-11f5c3ebfabc', 4, 'promotion', 'seed-campaign-4', 'available', '2026-11-09 02:24:02', NULL, '2026-11-09 02:24:02', '2026-11-09 02:24:02'),
(22, '32dc5cb6-dfa4-d861-17b7-16128391058c', 7, 'promotion', 'seed-campaign-7', 'available', '2026-11-11 02:24:02', NULL, '2026-11-11 02:24:02', '2026-11-11 02:24:02'),
(23, 'd741cf38-85e7-6fdc-bfb4-e9f01fa0ac4a', 2, 'promotion', 'seed-campaign-2', 'available', '2026-11-08 02:24:02', NULL, '2026-11-08 02:24:02', '2026-11-08 02:24:02'),
(24, 'd1158e10-1fb5-8d0b-7ab2-b5ad00354462', 5, 'promotion', 'seed-campaign-5', 'available', '2026-11-10 02:24:02', NULL, '2026-11-10 02:24:02', '2026-11-10 02:24:02'),
(25, '4937a1c4-62c8-5d35-3433-527614265df0', 8, 'promotion', 'seed-campaign-8', 'available', '2026-11-12 02:24:02', NULL, '2026-11-12 02:24:02', '2026-11-12 02:24:02'),
(26, 'a83143c9-3367-62a4-1a5c-d250674a1646', 3, 'promotion', 'seed-campaign-3', 'available', '2026-11-09 02:24:02', NULL, '2026-11-09 02:24:02', '2026-11-09 02:24:02'),
(27, 'dd1ecb58-65a6-92bf-dd73-2f17941c977b', 6, 'promotion', 'seed-campaign-6', 'available', '2026-11-11 02:24:02', NULL, '2026-11-11 02:24:02', '2026-11-11 02:24:02'),
(28, '8422156d-3226-4379-1db3-86d8a6f18a5e', 1, 'promotion', 'seed-campaign-1', 'available', '2026-11-08 02:24:02', NULL, '2026-11-08 02:24:02', '2026-11-08 02:24:02'),
(29, '8f90ee9c-9303-a25d-6d77-f711e7ef84e6', 4, 'promotion', 'seed-campaign-4', 'available', '2026-11-10 02:24:02', NULL, '2026-11-10 02:24:02', '2026-11-10 02:24:02'),
(30, 'cb8dbbb2-6e48-067a-4c9e-e8cfd2d385cb', 7, 'promotion', 'seed-campaign-7', 'available', '2026-11-12 02:24:02', NULL, '2026-11-12 02:24:02', '2026-11-12 02:24:02'),
(31, '6523275d-f48d-41a5-0d49-72d139ce2711', 2, 'promotion', 'seed-campaign-2', 'available', '2026-11-09 02:24:02', NULL, '2026-11-09 02:24:02', '2026-11-09 02:24:02'),
(32, 'fd1a4098-c0e9-2f33-f52d-b2b92cef814c', 5, 'promotion', 'seed-campaign-5', 'available', '2026-11-11 02:24:02', NULL, '2026-11-11 02:24:02', '2026-11-11 02:24:02'),
(33, '6fbb8c86-9231-b8a1-88d3-646663652350', 8, 'promotion', 'seed-campaign-8', 'available', '2026-11-08 02:24:02', NULL, '2026-11-08 02:24:02', '2026-11-08 02:24:02'),
(34, '4920f24e-514f-e2cd-08c0-3adf50220e53', 3, 'promotion', 'seed-campaign-3', 'available', '2026-11-10 02:24:02', NULL, '2026-11-10 02:24:02', '2026-11-10 02:24:02'),
(35, '4a41bf20-08d0-3256-2da1-473d2df9332d', 6, 'promotion', 'seed-campaign-6', 'available', '2026-11-12 02:24:02', NULL, '2026-11-12 02:24:02', '2026-11-12 02:24:02'),
(36, 'c323571d-d64c-f97c-2808-140d3610f2eb', 1, 'promotion', 'seed-campaign-1', 'available', '2026-11-09 02:24:02', NULL, '2026-11-09 02:24:02', '2026-11-09 02:24:02'),
(37, 'ddc8ad23-f5d1-dbc4-0919-7a0eb049e67c', 4, 'promotion', 'seed-campaign-4', 'available', '2026-11-11 02:24:02', NULL, '2026-11-11 02:24:02', '2026-11-11 02:24:02'),
(38, 'bf03fbce-d1d2-7300-136d-f61e4acdbe91', 7, 'promotion', 'seed-campaign-7', 'available', '2026-11-08 02:24:02', NULL, '2026-11-08 02:24:02', '2026-11-08 02:24:02'),
(39, '8234251c-184e-4d14-e02b-63b6b5869842', 2, 'promotion', 'seed-campaign-2', 'available', '2026-11-10 02:24:02', NULL, '2026-11-10 02:24:02', '2026-11-10 02:24:02'),
(40, 'fb22fb2e-476d-d51c-8f73-08aa30e70f4b', 5, 'promotion', 'seed-campaign-5', 'available', '2026-11-12 02:24:02', NULL, '2026-11-12 02:24:02', '2026-11-12 02:24:02'),
(41, '37fcb800-49bf-9dbf-c867-fc9d233699c1', 8, 'promotion', 'seed-campaign-8', 'available', '2026-11-09 02:24:02', NULL, '2026-11-09 02:24:02', '2026-11-09 02:24:02'),
(42, '74e3c558-0560-b63b-ba00-8a01fc6af72a', 3, 'promotion', 'seed-campaign-3', 'available', '2026-11-11 02:24:02', NULL, '2026-11-11 02:24:02', '2026-11-11 02:24:02'),
(43, '62846adc-59a0-1459-ca7b-6d67b7cb98bb', 6, 'promotion', 'seed-campaign-6', 'available', '2026-11-08 02:24:02', NULL, '2026-11-08 02:24:02', '2026-11-08 02:24:02'),
(44, '331429a9-ba63-a268-3e5d-49912a26b5df', 1, 'promotion', 'seed-campaign-1', 'available', '2026-11-10 02:24:02', NULL, '2026-11-10 02:24:02', '2026-11-10 02:24:02'),
(45, '36333497-c72b-06cc-4875-815d9af60356', 4, 'promotion', 'seed-campaign-4', 'available', '2026-11-12 02:24:02', NULL, '2026-11-12 02:24:02', '2026-11-12 02:24:02'),
(46, '20d503c5-6e99-eb51-0cbd-2725f7e2e876', 7, 'promotion', 'seed-campaign-7', 'available', '2026-11-09 02:24:02', NULL, '2026-11-09 02:24:02', '2026-11-09 02:24:02'),
(47, '74266d05-6397-1296-991e-3d76c6ad9122', 2, 'promotion', 'seed-campaign-2', 'available', '2026-11-11 02:24:02', NULL, '2026-11-11 02:24:02', '2026-11-11 02:24:02'),
(48, '3221a57c-2610-e0e3-593c-6b7c8f444086', 5, 'promotion', 'seed-campaign-5', 'available', '2026-11-08 02:24:02', NULL, '2026-11-08 02:24:02', '2026-11-08 02:24:02'),
(49, 'dcaf3e0f-c3e0-3dd6-e158-cca1ec2560ad', 8, 'promotion', 'seed-campaign-8', 'available', '2026-11-10 02:24:02', NULL, '2026-11-10 02:24:02', '2026-11-10 02:24:02'),
(50, '3dbd1354-8f7a-40b0-6247-23fcd4c8f491', 3, 'promotion', 'seed-campaign-3', 'available', '2026-11-12 02:24:02', NULL, '2026-11-12 02:24:02', '2026-11-12 02:24:02'),
(51, '847439d3-e0dd-ae2f-0ee8-9a07860386bd', 6, 'promotion', 'seed-campaign-6', 'available', '2026-11-09 02:24:02', NULL, '2026-11-09 02:24:02', '2026-11-09 02:24:02');

-- --------------------------------------------------------

--
-- Table structure for table `vouchers`
--

CREATE TABLE `vouchers` (
  `id` bigint UNSIGNED NOT NULL,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `discount_target` enum('product','shipping') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'product',
  `discount_type` enum('fixed','percentage') COLLATE utf8mb4_unicode_ci NOT NULL,
  `discount_value` decimal(15,2) NOT NULL,
  `min_spend` decimal(15,2) NOT NULL DEFAULT '0.00',
  `min_items` int UNSIGNED DEFAULT NULL,
  `min_distinct_products` int UNSIGNED DEFAULT NULL,
  `terms` text COLLATE utf8mb4_unicode_ci,
  `max_discount` decimal(15,2) DEFAULT NULL,
  `starts_at` timestamp NOT NULL,
  `ends_at` timestamp NOT NULL,
  `usage_limit` int UNSIGNED NOT NULL DEFAULT '0',
  `used_count` int UNSIGNED NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_by` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `vouchers`
--

INSERT INTO `vouchers` (`id`, `code`, `name`, `image`, `discount_target`, `discount_type`, `discount_value`, `min_spend`, `min_items`, `min_distinct_products`, `terms`, `max_discount`, `starts_at`, `ends_at`, `usage_limit`, `used_count`, `is_active`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'FASHIONKU25', 'Potongan 25RB untuk Koleksi Baru', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&h=480&q=80', 'product', 'fixed', 25000.00, 200000.00, 1, 1, 'Berlaku selama periode promo Fashionku. Satu voucher untuk satu transaksi, tidak dapat digabung dengan promo lain.', NULL, '2026-09-30 02:24:02', '2027-01-28 02:24:02', 500, 4, 1, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 02:23:55', '2026-11-14 02:24:02', NULL),
(2, 'GRATISONGKIR', 'Gratis Ongkir Se-Indonesia', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&h=480&q=80', 'shipping', 'fixed', 20000.00, 150000.00, 1, 1, 'Berlaku selama periode promo Fashionku. Satu voucher untuk satu transaksi, tidak dapat digabung dengan promo lain.', 20000.00, '2026-09-15 02:24:02', '2027-02-12 02:24:02', 800, 2, 1, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 02:23:55', '2026-11-14 02:24:02', NULL),
(3, 'FKU10', 'Diskon 10% Semua Kategori', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&h=480&q=80', 'product', 'percentage', 10.00, 250000.00, 1, 1, 'Berlaku selama periode promo Fashionku. Satu voucher untuk satu transaksi, tidak dapat digabung dengan promo lain.', 75000.00, '2026-10-15 02:24:02', '2027-01-13 02:24:02', 400, 6, 1, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 02:23:55', '2026-11-14 02:24:02', NULL),
(4, 'NEWCOMER50', 'Voucher Pembeli Baru 50RB', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&h=480&q=80', 'product', 'fixed', 50000.00, 300000.00, 1, 1, 'Berlaku selama periode promo Fashionku. Satu voucher untuk satu transaksi, tidak dapat digabung dengan promo lain.', NULL, '2026-08-16 02:24:02', '2026-12-29 02:24:02', 300, 0, 1, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 02:23:55', '2026-11-14 02:23:55', NULL),
(5, 'WEEKENDSALE', 'Diskon Akhir Pekan 15%', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&h=480&q=80', 'product', 'percentage', 15.00, 350000.00, 1, 1, 'Berlaku selama periode promo Fashionku. Satu voucher untuk satu transaksi, tidak dapat digabung dengan promo lain.', 120000.00, '2026-10-25 02:24:02', '2026-12-14 02:24:02', 250, 1, 1, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 02:23:55', '2026-11-14 02:24:02', NULL),
(6, 'BatikDay', 'Spesial Batik Nusantara 30RB', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&h=480&q=80', 'product', 'fixed', 30000.00, 250000.00, 1, 1, 'Berlaku selama periode promo Fashionku. Satu voucher untuk satu transaksi, tidak dapat digabung dengan promo lain.', NULL, '2026-10-30 02:24:02', '2026-12-24 02:24:02', 200, 1, 1, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 02:23:55', '2026-11-14 02:24:02', NULL),
(7, 'SEPATU100', 'Potongan 100RB Kategori Sepatu', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&h=480&q=80', 'product', 'fixed', 100000.00, 600000.00, 1, 1, 'Berlaku selama periode promo Fashionku. Satu voucher untuk satu transaksi, tidak dapat digabung dengan promo lain.', NULL, '2026-10-05 02:24:02', '2027-01-03 02:24:02', 120, 5, 1, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 02:23:55', '2026-11-14 02:24:02', NULL),
(8, 'FREESHIPMIN300', 'Bebas Ongkir Min. 300RB', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&h=480&q=80', 'shipping', 'fixed', 25000.00, 300000.00, 1, 1, 'Berlaku selama periode promo Fashionku. Satu voucher untuk satu transaksi, tidak dapat digabung dengan promo lain.', 25000.00, '2026-07-17 02:24:02', '2027-03-14 02:24:02', 600, 0, 1, 'ea469813-e902-00b9-1bf4-a15e254ce82d', 'ea469813-e902-00b9-1bf4-a15e254ce82d', '2026-11-14 02:23:55', '2026-11-14 02:23:55', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `wishlists`
--

CREATE TABLE `wishlists` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'utama',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `wishlists`
--

INSERT INTO `wishlists` (`id`, `user_id`, `name`, `created_at`, `updated_at`) VALUES
('019f4cad-690e-e53d-8125-6d4d4d3ef825', '0112d875-50e7-9f82-e3db-8b236203ae0c', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('07576e21-72d5-7abf-d6e8-e47235b3c18f', '266fa5bb-8cc7-149a-46d9-09d1f0c8fe90', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('0ec614dd-6333-cc15-bbf2-0736d005e3a7', 'b430a205-e6c4-f1a2-dd01-89b5c8728d3f', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('0ff9fbce-99ef-9d4b-7523-004c397e2a59', 'dd1ecb58-65a6-92bf-dd73-2f17941c977b', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('109a8855-44a9-8d47-a492-4b576941600d', '487eb68d-0b76-e01a-b043-b572294cd606', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('13de2158-5a9c-fd4b-ee9d-2641c2fac090', '62846adc-59a0-1459-ca7b-6d67b7cb98bb', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('141ff690-b382-8c2f-9db7-161b42006085', '8422156d-3226-4379-1db3-86d8a6f18a5e', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('1587262e-b969-f07e-8a42-2f7a24d3c172', 'a83143c9-3367-62a4-1a5c-d250674a1646', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('160df1a9-fa2c-b14d-cddd-09a4f49771a1', '1e269f2c-8386-1ef0-ff8e-1494bf3746a3', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('170a3d5c-796b-9898-f845-842dfb1268da', '3b0b84b6-6ba3-0c40-a16d-a075b449aa0d', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('184ba6f4-f0f0-06d7-647d-96cafbb20e2e', '777afe4c-4837-d716-a13c-846e9cd8cd7a', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('2270c8ba-53c7-8e2c-9348-6a5c3415797b', 'c323571d-d64c-f97c-2808-140d3610f2eb', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('270a7362-7bd7-62b8-4c7e-5cc4a077473b', 'c9858af3-80a2-1b07-293a-da94c650ac94', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('296ca0db-cb38-60e7-d401-d9bb63840fae', '028f8278-dfa1-4d9d-a2fb-eddd26813921', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('2b05064b-c081-0a9b-48f9-65891d87148d', '8f90ee9c-9303-a25d-6d77-f711e7ef84e6', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('2c41dfbb-3b71-f5c4-660a-80e26a5d4bcd', 'eb50c71c-58bf-77e2-f3b9-920c25108c95', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('2de4f6ef-2420-e53f-f904-18b64fdda172', '20fea1be-a8f1-ea19-daa2-891de5e06685', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('30aa8142-3cf1-c948-27e7-b59f45a4fdc8', 'e61c80b0-3705-187e-58b5-70d1edb6ed8f', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('37f62074-e862-b2ce-edd1-495e67ccf1f1', '68cea60f-963e-3cf9-2f5d-579d2cffe41b', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('3a22aeb0-7d6d-8524-e139-65cd966dc1ae', 'd741cf38-85e7-6fdc-bfb4-e9f01fa0ac4a', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('3a4d705c-71b8-3c0b-420b-2ea1790f84a2', '568ac464-063b-302b-c6f0-9a384b93f540', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('3e2fd854-4deb-f923-513d-c8b396af8d64', '87ee7bc6-865f-4f03-f910-a1d267178717', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('4154d99d-0854-f942-e54a-25eb6df75461', '5e73f21e-65ff-583e-b0b2-49790262bd99', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('42152d19-2d95-05e8-add3-05d8845944dd', 'b4844148-08c8-975a-6f83-f4eddd7fa28a', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('42665765-925e-854b-ff3a-b60644fcb331', 'c0d89002-20de-8855-3335-a6eb7ec4038f', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('4337354d-0681-6e84-2e9a-341e8830fa22', 'bf03fbce-d1d2-7300-136d-f61e4acdbe91', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('4375f5cc-51c3-7e9e-c7c1-2e4558528687', '76fe5857-9fc0-e31b-449f-0ec9892d2459', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('47681c02-6cdc-f523-8959-a9c7baafbb8a', '74e3c558-0560-b63b-ba00-8a01fc6af72a', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('496a5c85-cb64-5dcd-7b93-c637e7415fc3', '20d503c5-6e99-eb51-0cbd-2725f7e2e876', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('4dc34869-33fc-1bf6-1b76-931093972fb2', '1b27d6c4-11e9-13d0-67d2-810e998376cc', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('542450d3-129d-fedb-d797-ba3cc4f1a93a', 'dcaf3e0f-c3e0-3dd6-e158-cca1ec2560ad', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('54bc600f-b849-21f0-537d-b097b5e332cb', 'd6279585-7e9d-a7d9-50b8-d20071ff20d5', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('573ad686-56ad-8ae9-01b3-9b8a932a2de8', 'abe56782-bb24-c759-25f7-e09751e8d336', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('578f21d4-8704-9247-d473-0f780e18b255', 'fb22fb2e-476d-d51c-8f73-08aa30e70f4b', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('5b8d8d9f-79d4-ef04-cd3d-e38147b34dd0', '2c230d3d-c8f6-ebf9-80d8-9238d4f2941a', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('5c84a714-0030-f079-1d6d-b96928b4439e', '97cec183-eea2-5e70-1751-2819621fdbf2', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('5d692ec9-0c21-db29-3ac3-b67ffc654184', '8769c09a-cfd0-0292-f0c8-30b58bf4f1d5', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('60921846-5fba-f4e8-4142-4c2f5e0858b9', '8234251c-184e-4d14-e02b-63b6b5869842', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('64c21a9f-62c4-b4e6-3387-1ff95537a4f8', '581c734e-1148-d4a2-2ba7-f6d32cc31d0f', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('64e6ab38-2bf4-2630-3752-219690d5bd70', 'dff1ab85-91bd-f4a1-f36c-a62f6c2ce82e', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('6a58bb93-83a4-e0b4-90dc-28317261f554', '331429a9-ba63-a268-3e5d-49912a26b5df', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('6b15ee15-83eb-b79f-5dec-3bf5fb918a30', 'be1f7f6c-786f-886f-70fd-1adf76c06110', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('7002cb00-2336-4192-3433-1c606186791e', '89a52d76-3cfc-c24c-cb98-21a4a56adbda', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('756204d3-c12b-e861-ad1b-acae25123a38', 'c867f90f-7824-10fe-2aa3-2359ffe920a3', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('75aa8298-0afc-fa6d-ae5c-bed2c02fcf72', '847439d3-e0dd-ae2f-0ee8-9a07860386bd', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('791e8325-7f1c-a63b-48cc-21a8874ed79b', '6fbb8c86-9231-b8a1-88d3-646663652350', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('7a3636e5-4a8f-8462-1dd0-1fb027441136', '6523275d-f48d-41a5-0d49-72d139ce2711', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('7bb10cee-7b7b-62d1-9c23-ff2f703a7db6', 'dcf53c7b-7960-20e7-e37b-ce04efcd9d31', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('7ea5f4a2-d243-1155-fe08-77d90f93f071', 'c5d9f141-2619-5ce4-055c-a13b1b030640', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('813e0b52-d5a2-4ae0-331c-d8548b15fc82', '01e1e35a-187c-d961-58ca-25d230056614', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('83ee5d4b-e5c5-ea14-df0c-b371bd07986e', '03d879fa-ea37-16e7-0382-d9e05bce0ea0', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('8724ed99-22b7-140f-9544-3d8c261eebd2', '83981746-29d9-2a4e-4c3d-45ae19bcb789', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('88a7a7d0-b312-8f32-61a0-88c002a79482', '0dc38b96-2c45-1fef-1143-7c08e97cf3cf', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('8a593d89-7b5e-00f4-85aa-680ff4db7e1c', '17aa9f53-81c1-7db5-a094-14b0cae5d4f2', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('8d0dd3e8-9622-125c-91aa-8becd5cb1f57', 'cf1106a3-b582-6454-caed-c4b9d720bdcd', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('8da08cbd-e986-c00a-f80a-c0de3da6e727', '4fe4a5a9-ca82-3950-aa71-8f06a919f0bf', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('8edb3acf-9ae7-3ef4-734b-282225f9211c', 'b1bd0bd7-5142-a51a-9155-576acb2bc84e', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('8f3ff7a7-3a5d-de2e-63ba-eced981ae353', '49be2788-69c8-d175-966e-a15bfc44a012', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('94683d53-6c28-6547-3beb-216711c13bb1', '74266d05-6397-1296-991e-3d76c6ad9122', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('94ed4d42-e14d-53a5-5d42-e224b39f3a96', '4999ee98-9d2f-16b5-4e45-782a5cbc2e18', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('94f4a13a-0a1d-529e-3068-2875bef43ad4', 'fb358165-f121-342b-620b-53a635217b97', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('95d0a98f-cec5-92cf-2469-d45fcf30bda8', '4a41bf20-08d0-3256-2da1-473d2df9332d', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('9bb57f62-c881-4106-69ce-a72cf1f32d54', 'ab398d16-9f7d-2929-aa2b-13f81d78d085', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('9e109570-a1a1-ff0f-6202-b48e945fbf03', 'a59b13c6-da0d-cc36-aa08-7fdb038f3e7a', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('a068910b-ae42-2b12-42fb-6206aaa1eccd', '7bdd6f0a-3f48-e6e8-ee16-ec8e84ff19ca', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('a22e1234-fb3c-4781-5166-4da8dbd8da3c', 'dc41400c-122c-90f0-d943-48a55f6f9abd', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('a2c15911-db13-035c-adeb-8d9d5799155f', 'a61ecb87-2715-a57d-a602-f41571558b3e', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('a8fa1156-ce04-ecc1-90a1-d8a3ba04fd0d', 'ddc8ad23-f5d1-dbc4-0919-7a0eb049e67c', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('abab053f-4a1a-6ba7-7c1b-3ad7247a8626', '8c0d42e6-e169-f777-614c-4c86da4b386d', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('b0962d0a-743a-8266-3e78-81430e260821', 'adae9f8e-378d-b2a2-3122-70eb31a99996', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('b312b043-6ea1-5266-0fd6-c5b2b5debb59', '4920f24e-514f-e2cd-08c0-3adf50220e53', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('b9de2bb5-5b74-bb27-53be-3be91ea4f1d5', '36333497-c72b-06cc-4875-815d9af60356', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('bbe0b58e-0dfb-785d-18f7-1db8fe73f8a8', '4937a1c4-62c8-5d35-3433-527614265df0', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('c11f4cc9-427c-3b5e-db4b-774fccce9451', 'cb8dbbb2-6e48-067a-4c9e-e8cfd2d385cb', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('c7304a52-b612-0e63-f63a-57ad20494812', 'ecb48677-ccbf-7d3d-76fd-8944218e0781', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('ccffab83-0cc2-0e7f-42c0-858afb962466', 'e237eb66-fa74-3577-7aed-437a8db49b60', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('cf64cb68-e16d-7b1f-9938-ce1f25172103', '3321e0dd-e12f-8a1a-db98-d2bc759a8436', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('d098043e-3f3f-bad7-bc32-09f1d00a8c63', 'accc1906-fb5d-6efc-24ed-0e0fb269c69e', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('d1e4b546-df80-4674-67c9-7f56dac78976', '83fcef72-cc4f-747a-ee98-7ca1bbda04f9', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('d317fa3f-82ad-a6ae-f934-a035969188e0', '3dbd1354-8f7a-40b0-6247-23fcd4c8f491', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('d48dc864-a10a-95eb-22e7-4337af7d4c4e', '306cd17b-c0d6-b1b1-cf06-11f5c3ebfabc', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('d74a2e3b-6b65-35d9-2f04-5067f0a654eb', 'dee09934-26d8-29d8-36e1-1781d5de4a77', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('d7a80119-34f4-e219-8cc4-b52a3f53d2a4', 'fd1a4098-c0e9-2f33-f52d-b2b92cef814c', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('de98c4ed-4c49-9232-b0b9-babb5fa5515f', '53c58789-9a09-c2a9-e0cd-c840a7530ddb', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('e18fb044-8306-473a-097e-79b6040b5e80', '32dc5cb6-dfa4-d861-17b7-16128391058c', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('e7e4ec47-c626-66f8-9694-4dde01b47922', '2f5b0694-e364-f9bd-e445-034953d50131', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('e8a450cd-c829-ef41-9333-1002c0b065b8', '5570cce1-49a1-d137-3658-ff2640f2c112', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('edc55c8c-7527-289d-c457-35bf85a515b3', '38a478fc-af46-dab9-a7f9-ebe250220e5c', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('eedfba9a-bccd-ba37-cea9-8019349dc868', '865931e8-2cc7-befe-d1a4-40f2184e8564', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('f11a7999-e752-5a69-fc01-83ffffb2aec5', 'e770f616-1223-c4da-de7b-e82721d80c40', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('f2620b82-1fca-061b-c8e6-9c6e3be4b258', '0fa38f39-7c4b-b50a-4de5-5843c793c295', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('f4c6e90c-64c7-167e-4c2e-208a0e2ea05b', 'd1158e10-1fb5-8d0b-7ab2-b5ad00354462', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('f5636cb2-78e8-c726-45aa-684ab6fc26fc', '3221a57c-2610-e0e3-593c-6b7c8f444086', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('f6d35066-0ef1-def2-ce61-d920513c20ab', '37fcb800-49bf-9dbf-c867-fc9d233699c1', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('f7c90807-6cb9-c81c-af16-02389957a778', '05ae4bc5-19bf-91e6-d6d6-f78747261a7f', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02'),
('f9915686-1da3-22f4-858b-473a0e088ce4', '3509673a-1d35-b0b9-594c-ff9f3e19b2a9', 'utama', '2026-08-16 02:24:02', '2026-11-14 02:24:02');

-- --------------------------------------------------------

--
-- Table structure for table `wishlist_items`
--

CREATE TABLE `wishlist_items` (
  `id` bigint UNSIGNED NOT NULL,
  `wishlist_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_id` bigint UNSIGNED NOT NULL,
  `added_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `wishlist_items`
--

INSERT INTO `wishlist_items` (`id`, `wishlist_id`, `product_id`, `added_at`) VALUES
(1, '64c21a9f-62c4-b4e6-3387-1ff95537a4f8', 2, '2026-11-13 02:24:02'),
(2, '64c21a9f-62c4-b4e6-3387-1ff95537a4f8', 7, '2026-11-13 02:24:02'),
(3, '8f3ff7a7-3a5d-de2e-63ba-eced981ae353', 4, '2026-11-12 02:24:02'),
(4, '8f3ff7a7-3a5d-de2e-63ba-eced981ae353', 9, '2026-11-12 02:24:02'),
(5, '8f3ff7a7-3a5d-de2e-63ba-eced981ae353', 15, '2026-11-12 02:24:02'),
(6, 'd48dc864-a10a-95eb-22e7-4337af7d4c4e', 6, '2026-11-11 02:24:02'),
(7, 'd48dc864-a10a-95eb-22e7-4337af7d4c4e', 11, '2026-11-11 02:24:02'),
(8, 'd48dc864-a10a-95eb-22e7-4337af7d4c4e', 17, '2026-11-11 02:24:02'),
(9, 'd48dc864-a10a-95eb-22e7-4337af7d4c4e', 22, '2026-11-11 02:24:02'),
(10, '813e0b52-d5a2-4ae0-331c-d8548b15fc82', 8, '2026-11-10 02:24:02'),
(11, 'e18fb044-8306-473a-097e-79b6040b5e80', 12, '2026-11-08 02:24:02'),
(12, 'e18fb044-8306-473a-097e-79b6040b5e80', 17, '2026-11-08 02:24:02'),
(13, 'e18fb044-8306-473a-097e-79b6040b5e80', 23, '2026-11-08 02:24:02'),
(14, 'f11a7999-e752-5a69-fc01-83ffffb2aec5', 14, '2026-11-07 02:24:02'),
(15, 'f11a7999-e752-5a69-fc01-83ffffb2aec5', 19, '2026-11-07 02:24:02'),
(16, 'f11a7999-e752-5a69-fc01-83ffffb2aec5', 25, '2026-11-07 02:24:02'),
(17, 'f11a7999-e752-5a69-fc01-83ffffb2aec5', 28, '2026-11-07 02:24:02'),
(18, '2de4f6ef-2420-e53f-f904-18b64fdda172', 16, '2026-11-06 02:24:02'),
(19, '3a22aeb0-7d6d-8524-e139-65cd966dc1ae', 18, '2026-11-05 02:24:02'),
(20, '3a22aeb0-7d6d-8524-e139-65cd966dc1ae', 24, '2026-11-05 02:24:02'),
(21, '573ad686-56ad-8ae9-01b3-9b8a932a2de8', 22, '2026-11-03 02:24:02'),
(22, '573ad686-56ad-8ae9-01b3-9b8a932a2de8', 26, '2026-11-03 02:24:02'),
(23, '573ad686-56ad-8ae9-01b3-9b8a932a2de8', 31, '2026-11-03 02:24:02'),
(24, '573ad686-56ad-8ae9-01b3-9b8a932a2de8', 36, '2026-11-03 02:24:02'),
(25, 'f4c6e90c-64c7-167e-4c2e-208a0e2ea05b', 24, '2026-11-02 02:24:02'),
(26, '83ee5d4b-e5c5-ea14-df0c-b371bd07986e', 25, '2026-11-01 02:24:02'),
(27, '83ee5d4b-e5c5-ea14-df0c-b371bd07986e', 30, '2026-11-01 02:24:02'),
(28, '42152d19-2d95-05e8-add3-05d8845944dd', 27, '2026-10-31 02:24:02'),
(29, '42152d19-2d95-05e8-add3-05d8845944dd', 31, '2026-10-31 02:24:02'),
(30, '42152d19-2d95-05e8-add3-05d8845944dd', 36, '2026-10-31 02:24:02'),
(31, '3e2fd854-4deb-f923-513d-c8b396af8d64', 30, '2026-10-29 02:24:02'),
(32, '170a3d5c-796b-9898-f845-842dfb1268da', 32, '2026-10-28 02:24:02'),
(33, '170a3d5c-796b-9898-f845-842dfb1268da', 38, '2026-10-28 02:24:02'),
(34, '1587262e-b969-f07e-8a42-2f7a24d3c172', 34, '2026-10-27 02:24:02'),
(35, '1587262e-b969-f07e-8a42-2f7a24d3c172', 40, '2026-10-27 02:24:02'),
(36, '1587262e-b969-f07e-8a42-2f7a24d3c172', 45, '2026-10-27 02:24:02'),
(37, 'a22e1234-fb3c-4781-5166-4da8dbd8da3c', 36, '2026-10-26 02:24:02'),
(38, 'a22e1234-fb3c-4781-5166-4da8dbd8da3c', 42, '2026-10-26 02:24:02'),
(39, 'a22e1234-fb3c-4781-5166-4da8dbd8da3c', 47, '2026-10-26 02:24:02'),
(40, 'a22e1234-fb3c-4781-5166-4da8dbd8da3c', 52, '2026-10-26 02:24:02'),
(41, '0ff9fbce-99ef-9d4b-7523-004c397e2a59', 41, '2026-10-24 02:24:02'),
(42, '0ff9fbce-99ef-9d4b-7523-004c397e2a59', 46, '2026-10-24 02:24:02'),
(43, '07576e21-72d5-7abf-d6e8-e47235b3c18f', 42, '2026-10-23 02:24:02'),
(44, '07576e21-72d5-7abf-d6e8-e47235b3c18f', 48, '2026-10-23 02:24:02'),
(45, '07576e21-72d5-7abf-d6e8-e47235b3c18f', 53, '2026-10-23 02:24:02'),
(46, 'c7304a52-b612-0e63-f63a-57ad20494812', 44, '2026-10-22 02:24:02'),
(47, 'c7304a52-b612-0e63-f63a-57ad20494812', 50, '2026-10-22 02:24:02'),
(48, 'c7304a52-b612-0e63-f63a-57ad20494812', 55, '2026-10-22 02:24:02'),
(49, 'c7304a52-b612-0e63-f63a-57ad20494812', 60, '2026-10-22 02:24:02'),
(50, '141ff690-b382-8c2f-9db7-161b42006085', 46, '2026-10-21 02:24:02'),
(51, '270a7362-7bd7-62b8-4c7e-5cc4a077473b', 50, '2026-11-13 02:24:02'),
(52, '270a7362-7bd7-62b8-4c7e-5cc4a077473b', 55, '2026-11-13 02:24:02'),
(53, '270a7362-7bd7-62b8-4c7e-5cc4a077473b', 61, '2026-11-13 02:24:02'),
(54, '2b05064b-c081-0a9b-48f9-65891d87148d', 52, '2026-11-12 02:24:02'),
(55, '2b05064b-c081-0a9b-48f9-65891d87148d', 57, '2026-11-12 02:24:02'),
(56, '2b05064b-c081-0a9b-48f9-65891d87148d', 62, '2026-11-12 02:24:02'),
(57, '2b05064b-c081-0a9b-48f9-65891d87148d', 66, '2026-11-12 02:24:02'),
(58, '9e109570-a1a1-ff0f-6202-b48e945fbf03', 54, '2026-11-11 02:24:02'),
(59, 'd098043e-3f3f-bad7-bc32-09f1d00a8c63', 56, '2026-11-10 02:24:02'),
(60, 'd098043e-3f3f-bad7-bc32-09f1d00a8c63', 61, '2026-11-10 02:24:02'),
(61, 'abab053f-4a1a-6ba7-7c1b-3ad7247a8626', 60, '2026-11-08 02:24:02'),
(62, 'abab053f-4a1a-6ba7-7c1b-3ad7247a8626', 64, '2026-11-08 02:24:02'),
(63, 'abab053f-4a1a-6ba7-7c1b-3ad7247a8626', 68, '2026-11-08 02:24:02'),
(64, 'abab053f-4a1a-6ba7-7c1b-3ad7247a8626', 71, '2026-11-08 02:24:02'),
(65, 'f7c90807-6cb9-c81c-af16-02389957a778', 61, '2026-11-07 02:24:02'),
(66, '7a3636e5-4a8f-8462-1dd0-1fb027441136', 63, '2026-11-06 02:24:02'),
(67, '7a3636e5-4a8f-8462-1dd0-1fb027441136', 67, '2026-11-06 02:24:02'),
(68, '88a7a7d0-b312-8f32-61a0-88c002a79482', 64, '2026-11-05 02:24:02'),
(69, '88a7a7d0-b312-8f32-61a0-88c002a79482', 68, '2026-11-05 02:24:02'),
(70, '88a7a7d0-b312-8f32-61a0-88c002a79482', 71, '2026-11-05 02:24:02'),
(71, 'd7a80119-34f4-e219-8cc4-b52a3f53d2a4', 67, '2026-11-03 02:24:02'),
(72, 'ccffab83-0cc2-0e7f-42c0-858afb962466', 68, '2026-11-02 02:24:02'),
(73, 'ccffab83-0cc2-0e7f-42c0-858afb962466', 72, '2026-11-02 02:24:02'),
(74, '296ca0db-cb38-60e7-d401-d9bb63840fae', 70, '2026-11-01 02:24:02'),
(75, '296ca0db-cb38-60e7-d401-d9bb63840fae', 73, '2026-11-01 02:24:02'),
(76, '296ca0db-cb38-60e7-d401-d9bb63840fae', 93, '2026-11-01 02:24:02'),
(77, '791e8325-7f1c-a63b-48cc-21a8874ed79b', 71, '2026-10-31 02:24:02'),
(78, '791e8325-7f1c-a63b-48cc-21a8874ed79b', 80, '2026-10-31 02:24:02'),
(79, '791e8325-7f1c-a63b-48cc-21a8874ed79b', 100, '2026-10-31 02:24:02'),
(80, '791e8325-7f1c-a63b-48cc-21a8874ed79b', 5, '2026-10-31 02:24:02'),
(81, 'b0962d0a-743a-8266-3e78-81430e260821', 75, '2026-10-29 02:24:02'),
(82, 'b0962d0a-743a-8266-3e78-81430e260821', 95, '2026-10-29 02:24:02'),
(83, 'b312b043-6ea1-5266-0fd6-c5b2b5debb59', 82, '2026-10-28 02:24:02'),
(84, 'b312b043-6ea1-5266-0fd6-c5b2b5debb59', 1, '2026-10-28 02:24:02'),
(85, 'b312b043-6ea1-5266-0fd6-c5b2b5debb59', 5, '2026-10-28 02:24:02'),
(86, '2c41dfbb-3b71-f5c4-660a-80e26a5d4bcd', 90, '2026-10-27 02:24:02'),
(87, '2c41dfbb-3b71-f5c4-660a-80e26a5d4bcd', 2, '2026-10-27 02:24:02'),
(88, '2c41dfbb-3b71-f5c4-660a-80e26a5d4bcd', 8, '2026-10-27 02:24:02'),
(89, '2c41dfbb-3b71-f5c4-660a-80e26a5d4bcd', 13, '2026-10-27 02:24:02'),
(90, '5b8d8d9f-79d4-ef04-cd3d-e38147b34dd0', 97, '2026-10-26 02:24:02'),
(91, 'de98c4ed-4c49-9232-b0b9-babb5fa5515f', 3, '2026-10-24 02:24:02'),
(92, 'de98c4ed-4c49-9232-b0b9-babb5fa5515f', 8, '2026-10-24 02:24:02'),
(93, 'de98c4ed-4c49-9232-b0b9-babb5fa5515f', 14, '2026-10-24 02:24:02'),
(94, 'cf64cb68-e16d-7b1f-9938-ce1f25172103', 5, '2026-10-23 02:24:02'),
(95, 'cf64cb68-e16d-7b1f-9938-ce1f25172103', 10, '2026-10-23 02:24:02'),
(96, 'cf64cb68-e16d-7b1f-9938-ce1f25172103', 15, '2026-10-23 02:24:02'),
(97, 'cf64cb68-e16d-7b1f-9938-ce1f25172103', 21, '2026-10-23 02:24:02'),
(98, '2270c8ba-53c7-8e2c-9348-6a5c3415797b', 7, '2026-10-22 02:24:02'),
(99, '94f4a13a-0a1d-529e-3068-2875bef43ad4', 9, '2026-10-21 02:24:02'),
(100, '94f4a13a-0a1d-529e-3068-2875bef43ad4', 14, '2026-10-21 02:24:02'),
(101, 'a8fa1156-ce04-ecc1-90a1-d8a3ba04fd0d', 13, '2026-11-13 02:24:02'),
(102, 'a8fa1156-ce04-ecc1-90a1-d8a3ba04fd0d', 18, '2026-11-13 02:24:02'),
(103, 'a8fa1156-ce04-ecc1-90a1-d8a3ba04fd0d', 24, '2026-11-13 02:24:02'),
(104, 'a8fa1156-ce04-ecc1-90a1-d8a3ba04fd0d', 27, '2026-11-13 02:24:02'),
(105, 'e7e4ec47-c626-66f8-9694-4dde01b47922', 15, '2026-11-12 02:24:02'),
(106, '756204d3-c12b-e861-ad1b-acae25123a38', 17, '2026-11-11 02:24:02'),
(107, '756204d3-c12b-e861-ad1b-acae25123a38', 22, '2026-11-11 02:24:02'),
(108, '4337354d-0681-6e84-2e9a-341e8830fa22', 19, '2026-11-10 02:24:02'),
(109, '4337354d-0681-6e84-2e9a-341e8830fa22', 24, '2026-11-10 02:24:02'),
(110, '4337354d-0681-6e84-2e9a-341e8830fa22', 28, '2026-11-10 02:24:02'),
(111, 'f2620b82-1fca-061b-c8e6-9c6e3be4b258', 23, '2026-11-08 02:24:02'),
(112, '60921846-5fba-f4e8-4142-4c2f5e0858b9', 25, '2026-11-07 02:24:02'),
(113, '60921846-5fba-f4e8-4142-4c2f5e0858b9', 28, '2026-11-07 02:24:02'),
(114, 'f9915686-1da3-22f4-858b-473a0e088ce4', 26, '2026-11-06 02:24:02'),
(115, 'f9915686-1da3-22f4-858b-473a0e088ce4', 31, '2026-11-06 02:24:02'),
(116, 'f9915686-1da3-22f4-858b-473a0e088ce4', 35, '2026-11-06 02:24:02'),
(117, '4375f5cc-51c3-7e9e-c7c1-2e4558528687', 27, '2026-11-05 02:24:02'),
(118, '4375f5cc-51c3-7e9e-c7c1-2e4558528687', 32, '2026-11-05 02:24:02'),
(119, '4375f5cc-51c3-7e9e-c7c1-2e4558528687', 38, '2026-11-05 02:24:02'),
(120, '4375f5cc-51c3-7e9e-c7c1-2e4558528687', 43, '2026-11-05 02:24:02'),
(121, '54bc600f-b849-21f0-537d-b097b5e332cb', 31, '2026-11-03 02:24:02'),
(122, '54bc600f-b849-21f0-537d-b097b5e332cb', 36, '2026-11-03 02:24:02'),
(123, 'edc55c8c-7527-289d-c457-35bf85a515b3', 32, '2026-11-02 02:24:02'),
(124, 'edc55c8c-7527-289d-c457-35bf85a515b3', 39, '2026-11-02 02:24:02'),
(125, 'edc55c8c-7527-289d-c457-35bf85a515b3', 44, '2026-11-02 02:24:02'),
(126, 'f6d35066-0ef1-def2-ce61-d920513c20ab', 34, '2026-11-01 02:24:02'),
(127, 'f6d35066-0ef1-def2-ce61-d920513c20ab', 41, '2026-11-01 02:24:02'),
(128, 'f6d35066-0ef1-def2-ce61-d920513c20ab', 46, '2026-11-01 02:24:02'),
(129, 'f6d35066-0ef1-def2-ce61-d920513c20ab', 51, '2026-11-01 02:24:02'),
(130, '8da08cbd-e986-c00a-f80a-c0de3da6e727', 36, '2026-10-31 02:24:02'),
(131, '47681c02-6cdc-f523-8959-a9c7baafbb8a', 41, '2026-10-29 02:24:02'),
(132, '47681c02-6cdc-f523-8959-a9c7baafbb8a', 47, '2026-10-29 02:24:02'),
(133, '47681c02-6cdc-f523-8959-a9c7baafbb8a', 52, '2026-10-29 02:24:02'),
(134, '4154d99d-0854-f942-e54a-25eb6df75461', 43, '2026-10-28 02:24:02'),
(135, '4154d99d-0854-f942-e54a-25eb6df75461', 49, '2026-10-28 02:24:02'),
(136, '4154d99d-0854-f942-e54a-25eb6df75461', 54, '2026-10-28 02:24:02'),
(137, '4154d99d-0854-f942-e54a-25eb6df75461', 59, '2026-10-28 02:24:02'),
(138, '4dc34869-33fc-1bf6-1b76-931093972fb2', 45, '2026-10-27 02:24:02'),
(139, '13de2158-5a9c-fd4b-ee9d-2641c2fac090', 47, '2026-10-26 02:24:02'),
(140, '13de2158-5a9c-fd4b-ee9d-2641c2fac090', 52, '2026-10-26 02:24:02'),
(141, '37f62074-e862-b2ce-edd1-495e67ccf1f1', 51, '2026-10-24 02:24:02'),
(142, '37f62074-e862-b2ce-edd1-495e67ccf1f1', 56, '2026-10-24 02:24:02'),
(143, '37f62074-e862-b2ce-edd1-495e67ccf1f1', 61, '2026-10-24 02:24:02'),
(144, '37f62074-e862-b2ce-edd1-495e67ccf1f1', 65, '2026-10-24 02:24:02'),
(145, '6a58bb93-83a4-e0b4-90dc-28317261f554', 53, '2026-10-23 02:24:02'),
(146, 'e8a450cd-c829-ef41-9333-1002c0b065b8', 55, '2026-10-22 02:24:02'),
(147, 'e8a450cd-c829-ef41-9333-1002c0b065b8', 60, '2026-10-22 02:24:02'),
(148, '8d0dd3e8-9622-125c-91aa-8becd5cb1f57', 57, '2026-10-21 02:24:02'),
(149, '8d0dd3e8-9622-125c-91aa-8becd5cb1f57', 62, '2026-10-21 02:24:02'),
(150, '8d0dd3e8-9622-125c-91aa-8becd5cb1f57', 65, '2026-10-21 02:24:02'),
(151, '42665765-925e-854b-ff3a-b60644fcb331', 61, '2026-11-13 02:24:02'),
(152, '8724ed99-22b7-140f-9544-3d8c261eebd2', 62, '2026-11-12 02:24:02'),
(153, '8724ed99-22b7-140f-9544-3d8c261eebd2', 66, '2026-11-12 02:24:02'),
(154, '496a5c85-cb64-5dcd-7b93-c637e7415fc3', 63, '2026-11-11 02:24:02'),
(155, '496a5c85-cb64-5dcd-7b93-c637e7415fc3', 67, '2026-11-11 02:24:02'),
(156, '496a5c85-cb64-5dcd-7b93-c637e7415fc3', 71, '2026-11-11 02:24:02'),
(157, '6b15ee15-83eb-b79f-5dec-3bf5fb918a30', 65, '2026-11-10 02:24:02'),
(158, '6b15ee15-83eb-b79f-5dec-3bf5fb918a30', 69, '2026-11-10 02:24:02'),
(159, '6b15ee15-83eb-b79f-5dec-3bf5fb918a30', 72, '2026-11-10 02:24:02'),
(160, '6b15ee15-83eb-b79f-5dec-3bf5fb918a30', 86, '2026-11-10 02:24:02'),
(161, '94683d53-6c28-6547-3beb-216711c13bb1', 68, '2026-11-08 02:24:02'),
(162, '94683d53-6c28-6547-3beb-216711c13bb1', 71, '2026-11-08 02:24:02'),
(163, 'a2c15911-db13-035c-adeb-8d9d5799155f', 69, '2026-11-07 02:24:02'),
(164, 'a2c15911-db13-035c-adeb-8d9d5799155f', 72, '2026-11-07 02:24:02'),
(165, 'a2c15911-db13-035c-adeb-8d9d5799155f', 89, '2026-11-07 02:24:02'),
(166, 'eedfba9a-bccd-ba37-cea9-8019349dc868', 70, '2026-11-06 02:24:02'),
(167, 'eedfba9a-bccd-ba37-cea9-8019349dc868', 76, '2026-11-06 02:24:02'),
(168, 'eedfba9a-bccd-ba37-cea9-8019349dc868', 96, '2026-11-06 02:24:02'),
(169, 'eedfba9a-bccd-ba37-cea9-8019349dc868', 4, '2026-11-06 02:24:02'),
(170, 'f5636cb2-78e8-c726-45aa-684ab6fc26fc', 71, '2026-11-05 02:24:02'),
(171, '7ea5f4a2-d243-1155-fe08-77d90f93f071', 78, '2026-11-03 02:24:02'),
(172, '7ea5f4a2-d243-1155-fe08-77d90f93f071', 98, '2026-11-03 02:24:02'),
(173, '7ea5f4a2-d243-1155-fe08-77d90f93f071', 4, '2026-11-03 02:24:02'),
(174, '542450d3-129d-fedb-d797-ba3cc4f1a93a', 85, '2026-11-02 02:24:02'),
(175, '542450d3-129d-fedb-d797-ba3cc4f1a93a', 1, '2026-11-02 02:24:02'),
(176, '542450d3-129d-fedb-d797-ba3cc4f1a93a', 6, '2026-11-02 02:24:02'),
(177, '542450d3-129d-fedb-d797-ba3cc4f1a93a', 12, '2026-11-02 02:24:02'),
(178, '64e6ab38-2bf4-2630-3752-219690d5bd70', 93, '2026-11-01 02:24:02'),
(179, '3a4d705c-71b8-3c0b-420b-2ea1790f84a2', 100, '2026-10-31 02:24:02'),
(180, '3a4d705c-71b8-3c0b-420b-2ea1790f84a2', 5, '2026-10-31 02:24:02'),
(181, '160df1a9-fa2c-b14d-cddd-09a4f49771a1', 4, '2026-10-29 02:24:02'),
(182, '160df1a9-fa2c-b14d-cddd-09a4f49771a1', 9, '2026-10-29 02:24:02'),
(183, '160df1a9-fa2c-b14d-cddd-09a4f49771a1', 14, '2026-10-29 02:24:02'),
(184, '160df1a9-fa2c-b14d-cddd-09a4f49771a1', 20, '2026-10-29 02:24:02'),
(185, '30aa8142-3cf1-c948-27e7-b59f45a4fdc8', 5, '2026-10-28 02:24:02'),
(186, '75aa8298-0afc-fa6d-ae5c-bed2c02fcf72', 8, '2026-10-27 02:24:02'),
(187, '75aa8298-0afc-fa6d-ae5c-bed2c02fcf72', 13, '2026-10-27 02:24:02'),
(188, '7bb10cee-7b7b-62d1-9c23-ff2f703a7db6', 10, '2026-10-26 02:24:02'),
(189, '7bb10cee-7b7b-62d1-9c23-ff2f703a7db6', 15, '2026-10-26 02:24:02'),
(190, '7bb10cee-7b7b-62d1-9c23-ff2f703a7db6', 21, '2026-10-26 02:24:02');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `addresses_user_id_is_primary_index` (`user_id`,`is_primary`),
  ADD KEY `addresses_komerce_destination_id_index` (`komerce_destination_id`),
  ADD KEY `addresses_is_primary_index` (`is_primary`);

--
-- Indexes for table `admin_notifications`
--
ALTER TABLE `admin_notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `admin_notifications_actor_id_foreign` (`actor_id`),
  ADD KEY `admin_notifications_user_unread_index` (`user_id`,`read_at`,`created_at`),
  ADD KEY `admin_notifications_module_unread_index` (`user_id`,`module`,`read_at`),
  ADD KEY `admin_notifications_reference_index` (`reference_type`,`reference_id`),
  ADD KEY `admin_notifications_module_index` (`module`),
  ADD KEY `admin_notifications_type_index` (`type`),
  ADD KEY `admin_notifications_read_at_index` (`read_at`),
  ADD KEY `admin_notifications_is_active_index` (`is_active`),
  ADD KEY `admin_notifications_deleted_at_index` (`deleted_at`);

--
-- Indexes for table `app_settings`
--
ALTER TABLE `app_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `app_settings_key_unique` (`key`),
  ADD KEY `app_settings_group_index` (`group`);

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
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `categories_parent_name_unique` (`parent_scope_id`,`name`),
  ADD UNIQUE KEY `categories_full_slug_unique` (`full_slug`),
  ADD KEY `categories_created_by_foreign` (`created_by`),
  ADD KEY `categories_updated_by_foreign` (`updated_by`),
  ADD KEY `categories_parent_id_sort_order_index` (`parent_id`,`sort_order`),
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
  ADD KEY `code_patterns_type_index` (`type`);

--
-- Indexes for table `conversations`
--
ALTER TABLE `conversations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `conversations_created_by_foreign` (`created_by`),
  ADD KEY `conversations_updated_by_foreign` (`updated_by`),
  ADD KEY `conversations_context_index` (`order_id`,`type`),
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
  ADD KEY `financial_payment_histories_recorded_by_foreign` (`recorded_by`),
  ADD KEY `fph_txn_paid_index` (`financial_transaction_id`,`paid_at`),
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
  ADD KEY `financial_transactions_report_index` (`type`,`status`,`occurred_at`),
  ADD KEY `financial_transactions_aging_index` (`type`,`due_date`,`status`),
  ADD KEY `financial_transactions_type_index` (`type`),
  ADD KEY `financial_transactions_category_index` (`category`),
  ADD KEY `financial_transactions_status_index` (`status`),
  ADD KEY `financial_transactions_due_date_index` (`due_date`),
  ADD KEY `financial_transactions_occurred_at_index` (`occurred_at`),
  ADD KEY `financial_transactions_settled_at_index` (`settled_at`),
  ADD KEY `financial_transactions_is_active_index` (`is_active`),
  ADD KEY `financial_transactions_deleted_at_index` (`deleted_at`);

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
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `orders_order_number_unique` (`order_number`),
  ADD KEY `orders_voucher_id_foreign` (`voucher_id`),
  ADD KEY `orders_user_id_created_at_index` (`user_id`,`created_at`),
  ADD KEY `orders_user_status_created_index` (`user_id`,`status`,`created_at`),
  ADD KEY `orders_payment_status_created_index` (`payment_status`,`created_at`),
  ADD KEY `orders_order_type_index` (`order_type`),
  ADD KEY `orders_preorder_release_at_index` (`preorder_release_at`),
  ADD KEY `orders_scheduled_at_index` (`scheduled_at`),
  ADD KEY `orders_received_at_index` (`received_at`),
  ADD KEY `orders_status_index` (`status`),
  ADD KEY `orders_payment_status_index` (`payment_status`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_items_sub_order_id_foreign` (`sub_order_id`),
  ADD KEY `order_items_variant_id_foreign` (`variant_id`),
  ADD KEY `order_items_product_created_index` (`product_id`,`created_at`);

--
-- Indexes for table `otp_challenges`
--
ALTER TABLE `otp_challenges`
  ADD PRIMARY KEY (`id`),
  ADD KEY `otp_challenges_email_purpose_consumed_index` (`email`,`purpose`,`consumed_at`),
  ADD KEY `otp_challenges_user_purpose_consumed_index` (`user_id`,`purpose`,`consumed_at`),
  ADD KEY `otp_challenges_challenge_purpose_index` (`challenge_id`,`purpose`),
  ADD KEY `otp_challenges_user_id_index` (`user_id`),
  ADD KEY `otp_challenges_email_index` (`email`),
  ADD KEY `otp_challenges_phone_index` (`phone`),
  ADD KEY `otp_challenges_purpose_index` (`purpose`),
  ADD KEY `otp_challenges_expires_at_index` (`expires_at`),
  ADD KEY `otp_challenges_challenge_id_index` (`challenge_id`),
  ADD KEY `otp_challenges_deleted_at_index` (`deleted_at`);

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
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `products_name_unique` (`name`),
  ADD UNIQUE KEY `products_slug_unique` (`slug`),
  ADD KEY `products_created_by_foreign` (`created_by`),
  ADD KEY `products_updated_by_foreign` (`updated_by`),
  ADD KEY `products_public_feed_index` (`status`,`is_active`,`deleted_at`),
  ADD KEY `products_category_status_index` (`primary_category_id`,`status`,`is_active`),
  ADD KEY `products_public_feed_idx` (`status`,`is_active`,`created_at`,`id`),
  ADD KEY `products_category_feed_idx` (`primary_category_id`,`status`,`is_active`,`created_at`,`id`),
  ADD KEY `products_admin_name_sort_idx` (`name`,`id`),
  ADD KEY `products_brand_index` (`brand`),
  ADD KEY `products_status_index` (`status`),
  ADD KEY `products_is_active_index` (`is_active`),
  ADD KEY `products_deleted_at_index` (`deleted_at`);

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
  ADD UNIQUE KEY `product_costings_product_id_unique` (`product_id`);

--
-- Indexes for table `product_costing_impacts`
--
ALTER TABLE `product_costing_impacts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_costing_impacts_raw_material_id_foreign` (`raw_material_id`),
  ADD KEY `product_costing_impacts_raw_material_cost_history_id_foreign` (`raw_material_cost_history_id`),
  ADD KEY `product_costing_impact_lookup` (`product_id`,`occurred_at`);

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
  ADD UNIQUE KEY `product_variants_product_name_unique` (`product_id`,`name`),
  ADD UNIQUE KEY `product_variants_sku_unique` (`sku`),
  ADD KEY `product_variants_product_id_is_default_index` (`product_id`,`is_default`),
  ADD KEY `product_variants_summary_idx` (`product_id`,`is_default`,`id`),
  ADD KEY `product_variants_sku_search_idx` (`sku`),
  ADD KEY `product_variants_price_filter_idx` (`product_id`,`is_default`,`price`,`id`),
  ADD KEY `product_variants_stock_filter_idx` (`product_id`,`is_default`,`stock`,`id`),
  ADD KEY `product_variants_stock_index` (`product_id`,`stock`),
  ADD KEY `product_variants_sale_default_idx` (`price_sale`,`is_default`),
  ADD KEY `product_variants_is_default_index` (`is_default`);

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
  ADD KEY `promotions_payment_approval_index` (`promotion_payment_id`,`approval_status`),
  ADD KEY `promotions_target_id_index` (`target_id`),
  ADD KEY `promotions_is_active_index` (`is_active`),
  ADD KEY `promotions_approval_status_index` (`approval_status`),
  ADD KEY `promotions_submitted_at_index` (`submitted_at`),
  ADD KEY `promotions_approved_at_index` (`approved_at`),
  ADD KEY `promotions_deleted_at_index` (`deleted_at`);

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
  ADD KEY `promotion_payments_status_deleted_index` (`status`,`deleted_at`),
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
  ADD UNIQUE KEY `raw_materials_code_unique` (`code`),
  ADD KEY `raw_materials_name_index` (`name`),
  ADD KEY `raw_materials_is_active_index` (`is_active`);

--
-- Indexes for table `raw_material_cost_histories`
--
ALTER TABLE `raw_material_cost_histories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rm_cost_history_movement_fk` (`raw_material_stock_movement_id`),
  ADD KEY `raw_material_cost_history_lookup` (`raw_material_id`,`occurred_at`),
  ADD KEY `raw_material_cost_histories_reference_number_index` (`reference_number`);

--
-- Indexes for table `raw_material_stock_movements`
--
ALTER TABLE `raw_material_stock_movements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `raw_material_movement_lookup` (`raw_material_id`,`occurred_at`),
  ADD KEY `raw_material_stock_movements_reference_number_index` (`reference_number`);

--
-- Indexes for table `registration_challenges`
--
ALTER TABLE `registration_challenges`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `registration_challenges_email_unique` (`email`),
  ADD KEY `registration_challenges_email_expires_index` (`email`,`expires_at`),
  ADD KEY `registration_challenges_firebase_uid_index` (`firebase_uid`),
  ADD KEY `registration_challenges_otp_challenge_id_index` (`otp_challenge_id`),
  ADD KEY `registration_challenges_expires_at_index` (`expires_at`),
  ADD KEY `registration_challenges_deleted_at_index` (`deleted_at`);

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
  ADD KEY `schedules_user_completed_date_index` (`user_id`,`is_completed`,`date`),
  ADD KEY `schedules_date_capacity_index` (`date`,`capacity`),
  ADD KEY `schedules_type_index` (`type`),
  ADD KEY `schedules_status_index` (`status`),
  ADD KEY `schedules_priority_index` (`priority`),
  ADD KEY `schedules_date_index` (`date`),
  ADD KEY `schedules_recurrence_index` (`recurrence`),
  ADD KEY `schedules_is_active_index` (`is_active`),
  ADD KEY `schedules_deleted_at_index` (`deleted_at`);

--
-- Indexes for table `security_events`
--
ALTER TABLE `security_events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `security_events_user_event_time_index` (`user_id`,`event_type`,`occurred_at`),
  ADD KEY `security_events_email_event_time_index` (`email`,`event_type`,`occurred_at`),
  ADD KEY `security_events_purpose_time_index` (`purpose`,`occurred_at`),
  ADD KEY `security_events_user_id_index` (`user_id`),
  ADD KEY `security_events_email_index` (`email`),
  ADD KEY `security_events_event_type_index` (`event_type`),
  ADD KEY `security_events_purpose_index` (`purpose`),
  ADD KEY `security_events_severity_index` (`severity`),
  ADD KEY `security_events_occurred_at_index` (`occurred_at`),
  ADD KEY `security_events_deleted_at_index` (`deleted_at`);

--
-- Indexes for table `seller_customers`
--
ALTER TABLE `seller_customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `seller_customers_user_id_unique` (`user_id`),
  ADD KEY `seller_customers_created_by_foreign` (`created_by`),
  ADD KEY `seller_customers_updated_by_foreign` (`updated_by`);

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
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `stock_movements`
--
ALTER TABLE `stock_movements`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `stock_movements_order_item_key_unique` (`order_item_id`,`movement_key`),
  ADD KEY `stock_movements_order_id_foreign` (`order_id`),
  ADD KEY `stock_movements_created_by_foreign` (`created_by`),
  ADD KEY `stock_movements_updated_by_foreign` (`updated_by`),
  ADD KEY `stock_movements_variant_occurred_index` (`variant_id`,`occurred_at`),
  ADD KEY `stock_movements_product_occurred_index` (`product_id`,`occurred_at`),
  ADD KEY `stock_movements_type_index` (`type`),
  ADD KEY `stock_movements_occurred_at_index` (`occurred_at`),
  ADD KEY `stock_movements_deleted_at_index` (`deleted_at`);

--
-- Indexes for table `sub_orders`
--
ALTER TABLE `sub_orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sub_orders_sub_order_number_unique` (`sub_order_number`),
  ADD KEY `sub_orders_status_created_index` (`status`,`created_at`),
  ADD KEY `sub_orders_order_index` (`order_id`),
  ADD KEY `sub_orders_status_index` (`status`);

--
-- Indexes for table `support_tickets`
--
ALTER TABLE `support_tickets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `support_tickets_ticket_number_unique` (`ticket_number`),
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
-- Indexes for table `user_devices`
--
ALTER TABLE `user_devices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_devices_sanctum_token_id_unique` (`sanctum_token_id`),
  ADD KEY `user_devices_user_status_index` (`user_id`,`status`),
  ADD KEY `user_devices_user_last_active_index` (`user_id`,`last_active_at`),
  ADD KEY `user_devices_user_id_index` (`user_id`),
  ADD KEY `user_devices_device_type_index` (`device_type`),
  ADD KEY `user_devices_last_active_at_index` (`last_active_at`),
  ADD KEY `user_devices_expires_at_index` (`expires_at`),
  ADD KEY `user_devices_status_index` (`status`),
  ADD KEY `user_devices_deleted_at_index` (`deleted_at`);

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
  ADD KEY `vouchers_created_by_foreign` (`created_by`),
  ADD KEY `vouchers_updated_by_foreign` (`updated_by`),
  ADD KEY `vouchers_period_index` (`is_active`,`starts_at`,`ends_at`,`deleted_at`),
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
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=98;

--
-- AUTO_INCREMENT for table `admin_notifications`
--
ALTER TABLE `admin_notifications`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `app_settings`
--
ALTER TABLE `app_settings`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chat_messages`
--
ALTER TABLE `chat_messages`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `code_patterns`
--
ALTER TABLE `code_patterns`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `conversations`
--
ALTER TABLE `conversations`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `financial_payment_histories`
--
ALTER TABLE `financial_payment_histories`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `financial_transactions`
--
ALTER TABLE `financial_transactions`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=89;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=133;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=265;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=133;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT for table `product_attributes`
--
ALTER TABLE `product_attributes`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `product_attribute_values`
--
ALTER TABLE `product_attribute_values`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT for table `product_costings`
--
ALTER TABLE `product_costings`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT for table `product_costing_impacts`
--
ALTER TABLE `product_costing_impacts`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=301;

--
-- AUTO_INCREMENT for table `product_materials`
--
ALTER TABLE `product_materials`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=201;

--
-- AUTO_INCREMENT for table `product_reviews`
--
ALTER TABLE `product_reviews`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=118;

--
-- AUTO_INCREMENT for table `product_variants`
--
ALTER TABLE `product_variants`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=329;

--
-- AUTO_INCREMENT for table `product_variant_values`
--
ALTER TABLE `product_variant_values`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=329;

--
-- AUTO_INCREMENT for table `promotions`
--
ALTER TABLE `promotions`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `promotion_payments`
--
ALTER TABLE `promotion_payments`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `raw_materials`
--
ALTER TABLE `raw_materials`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `raw_material_cost_histories`
--
ALTER TABLE `raw_material_cost_histories`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `raw_material_stock_movements`
--
ALTER TABLE `raw_material_stock_movements`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=99;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `schedules`
--
ALTER TABLE `schedules`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `seller_customers`
--
ALTER TABLE `seller_customers`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=97;

--
-- AUTO_INCREMENT for table `shipping_settings`
--
ALTER TABLE `shipping_settings`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `stock_movements`
--
ALTER TABLE `stock_movements`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=589;

--
-- AUTO_INCREMENT for table `sub_orders`
--
ALTER TABLE `sub_orders`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=133;

--
-- AUTO_INCREMENT for table `support_tickets`
--
ALTER TABLE `support_tickets`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `support_ticket_messages`
--
ALTER TABLE `support_ticket_messages`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `user_vouchers`
--
ALTER TABLE `user_vouchers`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `vouchers`
--
ALTER TABLE `vouchers`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `wishlist_items`
--
ALTER TABLE `wishlist_items`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=191;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `addresses`
--
ALTER TABLE `addresses`
  ADD CONSTRAINT `addresses_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `admin_notifications`
--
ALTER TABLE `admin_notifications`
  ADD CONSTRAINT `admin_notifications_actor_id_foreign` FOREIGN KEY (`actor_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `admin_notifications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

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
-- Constraints for table `categories`
--
ALTER TABLE `categories`
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
-- Constraints for table `conversations`
--
ALTER TABLE `conversations`
  ADD CONSTRAINT `conversations_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `conversations_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL,
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
  ADD CONSTRAINT `financial_payment_histories_recorded_by_foreign` FOREIGN KEY (`recorded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `financial_transactions`
--
ALTER TABLE `financial_transactions`
  ADD CONSTRAINT `financial_transactions_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `financial_transactions_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `financial_transactions_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `financial_transactions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

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
  ADD CONSTRAINT `order_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `order_items_sub_order_id_foreign` FOREIGN KEY (`sub_order_id`) REFERENCES `sub_orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_variant_id_foreign` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_order_number_foreign` FOREIGN KEY (`order_number`) REFERENCES `orders` (`order_number`) ON DELETE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `products_primary_category_id_foreign` FOREIGN KEY (`primary_category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
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
  ADD CONSTRAINT `product_costings_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_costing_impacts`
--
ALTER TABLE `product_costing_impacts`
  ADD CONSTRAINT `product_costing_impacts_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `product_costing_impacts_raw_material_cost_history_id_foreign` FOREIGN KEY (`raw_material_cost_history_id`) REFERENCES `raw_material_cost_histories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `product_costing_impacts_raw_material_id_foreign` FOREIGN KEY (`raw_material_id`) REFERENCES `raw_materials` (`id`) ON DELETE SET NULL;

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
  ADD CONSTRAINT `product_variants_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

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
  ADD CONSTRAINT `promotions_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `promotion_payments`
--
ALTER TABLE `promotion_payments`
  ADD CONSTRAINT `promotion_payments_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `promotion_payments_reviewed_by_foreign` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `promotion_payments_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `promotion_payments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `raw_material_cost_histories`
--
ALTER TABLE `raw_material_cost_histories`
  ADD CONSTRAINT `raw_material_cost_histories_raw_material_id_foreign` FOREIGN KEY (`raw_material_id`) REFERENCES `raw_materials` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `rm_cost_history_movement_fk` FOREIGN KEY (`raw_material_stock_movement_id`) REFERENCES `raw_material_stock_movements` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `raw_material_stock_movements`
--
ALTER TABLE `raw_material_stock_movements`
  ADD CONSTRAINT `raw_material_stock_movements_raw_material_id_foreign` FOREIGN KEY (`raw_material_id`) REFERENCES `raw_materials` (`id`) ON DELETE CASCADE;

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
  ADD CONSTRAINT `schedules_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `schedules_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `seller_customers`
--
ALTER TABLE `seller_customers`
  ADD CONSTRAINT `seller_customers_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `seller_customers_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `seller_customers_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `stock_movements`
--
ALTER TABLE `stock_movements`
  ADD CONSTRAINT `stock_movements_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `stock_movements_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `stock_movements_order_item_id_foreign` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `stock_movements_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `stock_movements_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `stock_movements_variant_id_foreign` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sub_orders`
--
ALTER TABLE `sub_orders`
  ADD CONSTRAINT `sub_orders_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `support_tickets`
--
ALTER TABLE `support_tickets`
  ADD CONSTRAINT `support_tickets_assigned_to_foreign` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `support_tickets_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `support_tickets_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL,
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
-- Constraints for table `user_devices`
--
ALTER TABLE `user_devices`
  ADD CONSTRAINT `user_devices_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

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
