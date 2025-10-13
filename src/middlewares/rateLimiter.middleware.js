import rateLimit from "express-rate-limit";
import { logger } from "../app/logging.js";
import { Response } from "../utils/utils.js";

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 120, // berapa request /menit bang
  standardHeaders: true,
  legacyHeaders: false,
  handler: async (req, res) => {
    const response = new Response(
      429,
      "to many request, rate limiter execed",
      null,
      null,
      false
    );
    res.status(response.status).json(response).end();
    logger.warn("your server get DDOS attack");
  },
});

export { limiter };
