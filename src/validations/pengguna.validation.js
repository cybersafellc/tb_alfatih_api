import Joi from "joi";

const create = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.string().valid("admin", "staff", "supervisor").required(),
  status: Joi.boolean().required(),
}).required();

const login = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
}).required();

const verify = Joi.object({
  user_id: Joi.string().required(),
}).required();

export default { create, login, verify };
