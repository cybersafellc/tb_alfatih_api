import Joi from "joi";

const create = Joi.object({
  numbers: Joi.number().required(),
  title: Joi.string().required(),
  details: Joi.string().required(),
}).required();

const get = Joi.object({
  id: Joi.string().optional(),
  page: Joi.number().optional(),
  items_per_page: Joi.number().optional(),
  search: Joi.string().optional(),
  desc: Joi.boolean().optional(),
}).required();

export default { create, get };
