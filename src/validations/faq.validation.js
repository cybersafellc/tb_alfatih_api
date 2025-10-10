import Joi from "joi";

const create = Joi.object({
  tahap_id: Joi.string().required(),
  title: Joi.string().required(),
  details: Joi.string().required(),
}).required();

const update = Joi.object({
  id: Joi.string().required(),
  tahap_id: Joi.string().optional(),
  title: Joi.string().optional(),
  details: Joi.string().optional(),
}).required();

const get = Joi.object({
  id: Joi.string().optional(),
  tahap_id: Joi.string().optional(),
  page: Joi.number().optional(),
  items_per_page: Joi.number().optional(),
  search: Joi.string().optional(),
  desc: Joi.boolean().optional(),
}).required();

const deletes = Joi.object({
  id: Joi.string().required(),
}).required();

export default { create, update, get, deletes };
