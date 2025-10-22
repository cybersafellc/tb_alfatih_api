import Joi from "joi";

const create = Joi.object({
  ip_address: Joi.string().required(),
  star: Joi.number().valid(1, 2, 3, 4, 5).required(),
  nama: Joi.string().required(),
  comment: Joi.string().required(),
}).required();

const get = Joi.object({
  id: Joi.string().optional(),
  page: Joi.number().optional(),
  items_per_page: Joi.number().optional(),
  search: Joi.string().optional(),
  desc: Joi.boolean().optional(),
}).required();

export default { create, get };
