import productService from "../services/product.service.js";

async function uploadProductImage(req, res, next) {
  try {
    const response = await productService.uploadProductImage({
      img_product: "/img/product/" + req?.file?.filename,
    });
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const response = await productService.create(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

async function get(req, res, next) {
  try {
    const response = await productService.get(req.query);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
}

export default { uploadProductImage, create, get };
