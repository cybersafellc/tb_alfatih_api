import { logger } from "../app/logging.js";
import { ResponseError } from "../errors/response-error.js";
import { Response } from "../utils/utils.js";

async function RouteNotFound(req, res, next) {
  try {
    throw new ResponseError(404, "not found");
  } catch (error) {
    next(error);
  }
}

async function ErrorHandler(err, req, res, next) {
  if (!err) {
    next();
    return;
  }

  if (err instanceof ResponseError) {
    const response = new Response(err.status, err.message, null, null, true);
    res.status(response.status).json(response).end();
  } else {
    const response = new Response(500, err.message, null, null, true);
    res.status(response.status).json(response).end();
    logger.error(response.message);
  }
}

export default { RouteNotFound, ErrorHandler };
