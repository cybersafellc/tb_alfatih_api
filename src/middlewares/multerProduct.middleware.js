import multer from "multer";
import path from "path";
import fs from "fs";

// Lokasi penyimpanan file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join("public/img/product/");

    // Buat folder jika belum ada
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Ganti nama file biar unik
    const uniqueSuffix = Date.now() + "-" + crypto.randomUUID();
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// Filter file: hanya izinkan gambar
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (allowedTypes.test(ext) && allowedTypes.test(mime)) {
    cb(null, true);
  } else {
    cb(new Error("Hanya file gambar yang diizinkan (jpeg, jpg, png, gif)!"));
  }
};

// Konfigurasi multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // maksimal 10 MB per file
  },
});

// Middleware untuk upload banyak gambar (misal field: "images")
// const uploadMultipleImages = upload.array("images", 10); // maksimal 10 gambar
const uploadProductImg = upload.single("img_product"); // maksimal 1 gambar

export { uploadProductImg };
