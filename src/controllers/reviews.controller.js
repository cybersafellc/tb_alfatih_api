import reviewsService from "../services/reviews.service.js";

async function create(req, res, next) {
  try {
    req.body ? (req.body.ip_address = await req.clientIp) : undefined;
    const response = await reviewsService.create(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

async function get(req, res, next) {
  try {
    const response = await reviewsService.get(req.query);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

export default { create, get };
