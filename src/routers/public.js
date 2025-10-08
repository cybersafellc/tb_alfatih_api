import express from "express";
import penggunaController from "../controllers/pengguna.controller.js";

const router = express.Router();
router.post("/users/auth", penggunaController.login);
export default router;
