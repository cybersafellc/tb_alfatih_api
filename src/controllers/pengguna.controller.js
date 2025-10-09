import penggunaService from "../services/pengguna.service.js";

async function AdminCreate(req, res, next) {
  try {
    const response = await penggunaService.AdminCreate(req.body);
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

async function adminUpdate(req, res, next) {
  try {
    const response = await penggunaService.adminUpdate(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

async function get(req, res, next) {
  try {
    const response = await penggunaService.get(req.query);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

async function getProfile(req, res, next) {
  try {
    const response = await penggunaService.getProfile({
      user_id: await req.user_id,
    });
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

async function updateImageProfile(req, res, next) {
  try {
    const response = await penggunaService.updateImageProfile({
      user_id: await req.user_id,
      img_profile: req?.file?.filename,
    });
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

export default {
  AdminCreate,
  login,
  verify,
  adminUpdate,
  get,
  getProfile,
  updateImageProfile,
};
