import tahapService from "../services/tahap.service.js";

async function create(req, res, next) {
  try {
    const response = await tahapService.create(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

async function get(req, res, next) {
  try {
    const response = await tahapService.get(req.query);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

export default { create, get };
