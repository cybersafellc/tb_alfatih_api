import sales_orderService from "../services/sales_order.service.js";

async function create(req, res, next) {
  try {
    req?.body ? (req.body.pengguna_id = await req.user_id) : undefined;
    const response = await sales_orderService.create(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

async function getSalesOrderByProfile(req, res, next) {
  try {
    const response = await sales_orderService.getSalesOrderByProfile({
      pengguna_id: req.user_id,
      ...req.query,
    });
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

async function deletes(req, res, next) {
  try {
    const response = await sales_orderService.deletes({
      pengguna_id: req.user_id,
      ...req.body,
    });
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

async function getSalesOrderBySupervisor(req, res, next) {
  try {
    const response = await sales_orderService.getSalesOrderBySupervisor({
      ...req.query,
    });
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

export default {
  create,
  getSalesOrderByProfile,
  deletes,
  getSalesOrderBySupervisor,
};
