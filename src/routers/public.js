import express from "express";
import penggunaController from "../controllers/pengguna.controller.js";
import reviewsController from "../controllers/reviews.controller.js";

const router = express.Router();
router.post("/users/auth", penggunaController.login);
router.post("/reviews", reviewsController.create);
router.get("/reviews", reviewsController.get);
export default router;
