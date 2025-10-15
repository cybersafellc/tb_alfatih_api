CREATE TABLE `pengguna` (
  `id` VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `username` VARCHAR(255) UNIQUE,
  `password` VARCHAR(255),
  `role` ENUM ('admin', 'supervisor', 'staff'),
  `status` BOOLEAN,
  `img_profile` TEXT,
  `created_at` DATETIME DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` DATETIME DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `tahap` (
  `id` VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `numbers` INT,
  `title` TEXT,
  `details` TEXT,
  `created_at` DATETIME DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` DATETIME DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `kategori` (
  `id` VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `tahap_id` VARCHAR(36),
  `name` VARCHAR(255),
  `created_at` DATETIME DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` DATETIME DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `faq` (
  `id` VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `tahap_id` VARCHAR(36),
  `title` TEXT,
  `details` TEXT,
  `created_at` DATETIME DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` DATETIME DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `products` (
  `id` VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `type` ENUM ('inti', 'cross_selling') NOT NULL,
  `name` TEXT,
  `jenis` TEXT,
  `prioritas_upselling` BOOLEAN,
  `harga_jual` INT,
  `kondisi_peruntukan` TEXT,
  `spesifikasi` TEXT,
  `kategori_id` VARCHAR(36),
  `ditolak` BOOLEAN DEFAULT false,
  `diproses` BOOLEAN DEFAULT false,
  `diterima` BOOLEAN DEFAULT false,
  `created_at` DATETIME DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` DATETIME DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `img_products` (
  `id` VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `product_id` VARCHAR(36),
  `path` TEXT,
  `created_at` DATETIME DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` DATETIME DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `cross_selling_connection` (
  `id` VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `product_inti_id` VARCHAR(36),
  `product_cross_selling_id` VARCHAR(36),
  `created_at` DATETIME DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` DATETIME DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `sales_order` (
  `id` VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `so_numbers` VARCHAR(36) UNIQUE,
  `pengguna_id` VARCHAR(36),
  `name` TEXT,
  `alamat` TEXT,
  `tanggal_janji_antar` DATETIME,
  `no_hp` VARCHAR(255),
  `proses_hapus` BOOLEAN DEFAULT false,
  `disetuji_hapus` BOOLEAN DEFAULT false,
  `created_at` DATETIME DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` DATETIME DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `details_sales_order` (
  `id` VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `sales_order_id` VARCHAR(36),
  `product_id` VARCHAR(36),
  `jumlah` INT,
  `created_at` DATETIME DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` DATETIME DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `draft_penawaran` (
  `id` VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `product_id` VARCHAR(36),
  `judul` TEXT,
  `chat` TEXT,
  `created_at` DATETIME DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` DATETIME DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `reviews` (
  `id` VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `ip_address` VARCHAR(255),
  `star` int,
  `nama` TEXT,
  `comment` TEXT,
  `created_at` DATETIME DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` DATETIME DEFAULT (CURRENT_TIMESTAMP)
);

ALTER TABLE `kategori` ADD FOREIGN KEY (`tahap_id`) REFERENCES `tahap` (`id`) ON DELETE CASCADE;

ALTER TABLE `faq` ADD FOREIGN KEY (`tahap_id`) REFERENCES `tahap` (`id`) ON DELETE CASCADE;

ALTER TABLE `products` ADD FOREIGN KEY (`kategori_id`) REFERENCES `kategori` (`id`) ON DELETE SET NULL;

ALTER TABLE `img_products` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

ALTER TABLE `cross_selling_connection` ADD FOREIGN KEY (`product_inti_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

ALTER TABLE `cross_selling_connection` ADD FOREIGN KEY (`product_cross_selling_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

ALTER TABLE `sales_order` ADD FOREIGN KEY (`pengguna_id`) REFERENCES `pengguna` (`id`) ON DELETE CASCADE;

ALTER TABLE `details_sales_order` ADD FOREIGN KEY (`sales_order_id`) REFERENCES `sales_order` (`id`) ON DELETE CASCADE;

ALTER TABLE `details_sales_order` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL;

ALTER TABLE `draft_penawaran` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL;
