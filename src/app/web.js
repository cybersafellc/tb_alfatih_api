import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import helmet from "helmet";
import errorMiddleware from "../middlewares/error.middleware.js";
import publicRouter from "../routers/public.js";
import privateRouter from "../routers/private.js";
import { limiter } from "../middlewares/rateLimiter.middleware.js";

export const web = express();

// for get real ip address
web.set("proxy trust", true);
// security protection
web.use(cors());
web.use(helmet());
web.use(limiter);
// public path
web.use("/", express.static("public"));
// required middlewares
web.use(cookieParser());
web.use(bodyParser.json());

// route
web.use("/private", privateRouter);
web.use("/public", publicRouter);
// err handler
web.use(errorMiddleware.RouteNotFound);
web.use(errorMiddleware.ErrorHandler);
