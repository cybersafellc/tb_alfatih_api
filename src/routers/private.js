import express from "express";
import penggunaController from "../controllers/pengguna.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import tahapController from "../controllers/tahap.controller.js";
import { uploadProfile } from "../middlewares/multer.middleware.js";
import kategoriController from "../controllers/kategori.controller.js";
import faqController from "../controllers/faq.controller.js";

const router = express.Router();
// tahap
router.post("/admin/tahap", authMiddleware.adminRole, tahapController.create);
router.get("/tahap", authMiddleware.allRole, tahapController.get);
// pengguna
router.post(
  "/admin/users",
  authMiddleware.adminRole,
  penggunaController.AdminCreate
);
router.put(
  "/admin/users",
  authMiddleware.adminRole,
  penggunaController.adminUpdate
);
router.get("/users", authMiddleware.allRole, penggunaController.get);
router.get("/profile", authMiddleware.allRole, penggunaController.getProfile);
router.put(
  "/profile/img",
  authMiddleware.allRole,
  uploadProfile,
  penggunaController.updateImageProfile
);
// kategori
router.post(
  "/admin/kategori",
  authMiddleware.adminRole,
  kategoriController.create
);
router.put(
  "/admin/kategori",
  authMiddleware.adminRole,
  kategoriController.update
);
router.get("/kategori", authMiddleware.allRole, kategoriController.get);
// faq
router.post("/admin/faq", authMiddleware.adminRole, faqController.create);
router.put("/admin/faq", authMiddleware.adminRole, faqController.update);
router.delete("/admin/faq", authMiddleware.adminRole, faqController.deletes);
router.get("/faq", authMiddleware.allRole, faqController.get);

// access token verify
router.get(
  "/admin/verify",
  authMiddleware.adminRole,
  penggunaController.verify
); // bisa get profile sekalian
router.get(
  "/supervisor/verify",
  authMiddleware.supervisorRole,
  penggunaController.verify
); // bisa get profile sekalian
router.get(
  "/staff/verify",
  authMiddleware.staffRole,
  penggunaController.verify
); // bisa get profile sekalian

export default router;
