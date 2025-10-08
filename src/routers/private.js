import express from "express";
import penggunaController from "../controllers/pengguna.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();
router.post("/users", penggunaController.create); // diaktifkan jika belum ada user samsek

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
