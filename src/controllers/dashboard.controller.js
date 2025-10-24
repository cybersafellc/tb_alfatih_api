import dashboardService from "../services/dashboard.service.js";

async function supervisorAktifitasStaff(req, res, next) {
  try {
    const response = await dashboardService.supervisorAktifitasStaff(req.query);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

async function supervisorGrafik(req, res, next) {
  try {
    const response = await dashboardService.supervisorGrafik(req.query);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

async function getProdukBaru(req, res, next) {
  try {
    const response = await dashboardService.getProdukBaru();
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

export default { supervisorAktifitasStaff, supervisorGrafik, getProdukBaru };
