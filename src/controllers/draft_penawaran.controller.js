import draft_penawaranService from "../services/draft_penawaran.service.js";

async function create(req, res, next) {
  try {
    const response = await draft_penawaranService.create(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const response = await draft_penawaranService.update(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

async function deletes(req, res, next) {
  try {
    const response = await draft_penawaranService.deletes(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

export default { create, update, deletes };
