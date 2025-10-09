import Joi from "joi";

const create = Joi.object({
  tahap_id: Joi.string().required(),
  name: Joi.string().required(),
}).required();

const get = Joi.object({
  id: Joi.string().optional(),
  tahap_id: Joi.string().optional(),
  page: Joi.number().optional(),
  items_per_page: Joi.number().optional(),
  search: Joi.string().optional(),
  desc: Joi.boolean().optional(),
}).required();

const update = Joi.object({
  id: Joi.string().required(),
  tahap_id: Joi.string().required(),
  name: Joi.string().required(),
}).required();

export default { create, get, update };
