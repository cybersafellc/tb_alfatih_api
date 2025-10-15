import Joi from "joi";

const create = Joi.object({
  product_id: Joi.string().required(),
  judul: Joi.string().required(),
  chat: Joi.string().required(),
}).required();

const update = Joi.object({
  id: Joi.string().required(),
  product_id: Joi.string().optional(),
  judul: Joi.string().optional(),
  chat: Joi.string().optional(),
}).required();

const deletes = Joi.object({
  id: Joi.string().required(),
}).required();

export default { create, update, deletes };
