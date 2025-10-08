import { logger } from "../src/app/logging.js";

describe("winston testing / loging testing", function () {
  it("error", function () {
    logger.error("message error");
  });
  it("warn", function () {
    logger.warn("message warn");
  });
  it("info", function () {
    logger.info("message info");
  });
});
