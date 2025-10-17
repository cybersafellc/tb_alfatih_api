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

export default { create };
