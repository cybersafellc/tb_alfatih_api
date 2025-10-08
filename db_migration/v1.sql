-- TABEL PENGGUNA
CREATE TABLE `pengguna` (
  `id` VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `username` VARCHAR(255) UNIQUE,
  `password` VARCHAR(255),
  `role` ENUM('admin', 'supervisor', 'staff'),
  `status` BOOLEAN,
  `img_profile` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- TABEL TAHAP
CREATE TABLE `tahap` (
  `id` VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `numbers` INT,
  `title` TEXT,
  `details` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- TABEL KATEGORI
CREATE TABLE `kategori` (
  `id` VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `tahap_id` VARCHAR(36),
  `name` VARCHAR(255),
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`tahap_id`) REFERENCES `tahap` (`id`) ON DELETE CASCADE
);

-- TABEL FAQ
CREATE TABLE `faq` (
  `id` VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `tahap_id` VARCHAR(36),
  `title` TEXT,
  `details` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`tahap_id`) REFERENCES `tahap` (`id`) ON DELETE CASCADE
);

-- TABEL PRODUCTS (GABUNG INTI + CROSS_SELLING)
CREATE TABLE `products` (
  `id` VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `type` ENUM('inti', 'cross_selling') NOT NULL,
  `name` TEXT,
  `jenis` TEXT,
  `prioritas_upselling` BOOLEAN,
  `harga_jual` INT,
  `kondisi_peruntukan` TEXT,
  `spesifikasi` TEXT,
  `kategori_id` VARCHAR(36),
  `ditolak` BOOLEAN DEFAULT FALSE,
  `diproses` BOOLEAN DEFAULT FALSE,
  `diterima` BOOLEAN DEFAULT FALSE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`kategori_id`) REFERENCES `kategori` (`id`) ON DELETE SET NULL
);

-- TABEL GAMBAR PRODUK
CREATE TABLE `img_products` (
  `id` VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `product_id` VARCHAR(36),
  `path` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
);

-- TABEL CROSS SELLING CONNECTION
CREATE TABLE `cross_selling_connection` (
  `id` VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `product_inti_id` VARCHAR(36),
  `product_cross_selling_id` VARCHAR(36),
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_inti_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_cross_selling_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
);

-- TABEL SALES ORDER
CREATE TABLE `sales_order` (
  `id` VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `pengguna_id` VARCHAR(36),
  `name` TEXT,
  `alamat` TEXT,
  `tanggal_janji_antar` DATETIME,
  `no_hp` VARCHAR(255),
  `proses_hapus` BOOLEAN DEFAULT FALSE,
  `disetuji_hapus` BOOLEAN DEFAULT FALSE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`pengguna_id`) REFERENCES `pengguna` (`id`) ON DELETE CASCADE
);

-- TABEL DETAIL SALES ORDER
CREATE TABLE `details_sales_order` (
  `id` VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `sales_order_id` VARCHAR(36),
  `product_id` VARCHAR(36),
  `jumlah` INT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`sales_order_id`) REFERENCES `sales_order` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL
);

-- TABEL DRAFT PENAWARAN
CREATE TABLE `draft_penawaran` (
  `id` VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `pengguna_id` VARCHAR(36),
  `product_id` VARCHAR(36),
  `salam_judul` TEXT,
  `salam_chat` TEXT,
  `tawar_produk_judul` TEXT,
  `tawar_produk_chat` TEXT,
  `cocok_untuk_judul` TEXT,
  `cocok_untuk_chat` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`pengguna_id`) REFERENCES `pengguna` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL
);
