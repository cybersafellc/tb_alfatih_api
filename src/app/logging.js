import { createLogger, format, transports } from "winston";
import winstonDailyRotateFile from "winston-daily-rotate-file";
import path from "path";

export const logger = createLogger({
  level: "info",
  handleExceptions: true,
  handleRejections: true,
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console(),
    new transports.DailyRotateFile({
      filename: path.join("tmp/combine-%DATE%.log"),
      zippedArchive: true,
      maxSize: "500m",
      maxFiles: "15d",
    }),
    new transports.DailyRotateFile({
      level: "error",
      filename: path.join("tmp/error-%DATE%.log"),
      zippedArchive: true,
      maxSize: "500m",
      maxFiles: "15d",
    }),
  ],
});
