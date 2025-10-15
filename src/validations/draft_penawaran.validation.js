import Joi from "joi";

const create = Joi.object({
  product_id: Joi.string().required(),
  judul: Joi.string().required(),
  chat: Joi.string().required(),
}).required();

export default { create };
