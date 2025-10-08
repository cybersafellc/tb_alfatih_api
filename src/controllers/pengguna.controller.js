import penggunaService from "../services/pengguna.service.js";

async function create(req, res, next) {
  try {
    const response = await penggunaService.create(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const response = await penggunaService.login(req.body);
    res.cookie("access_token", response.data.access_token);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

async function verify(req, res, next) {
  try {
    const response = await penggunaService.verify({
      user_id: await req.user_id,
    });
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

export default { create, login, verify };
