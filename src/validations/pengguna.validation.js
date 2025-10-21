import Joi from "joi";

const AdminCreate = Joi.object({
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

const adminUpdate = Joi.object({
  id: Joi.string().required(),
  username: Joi.string().optional(),
  password: Joi.string().optional(),
  role: Joi.string().valid("admin", "staff", "supervisor").optional(),
  status: Joi.boolean().optional(),
}).required();

const get = Joi.object({
  id: Joi.string().optional(),
  page: Joi.number().optional(),
  items_per_page: Joi.number().optional(),
  search: Joi.string().optional(),
  desc: Joi.boolean().optional(),
}).required();

const getProfile = Joi.object({
  user_id: Joi.string().required(),
}).required();

const updateImageProfile = Joi.object({
  user_id: Joi.string().required(),
  img_profile: Joi.string().required(),
}).required();

const getBySupervisor = Joi.object({
  id: Joi.string().optional(),
  page: Joi.number().optional(),
  items_per_page: Joi.number().optional(),
  search: Joi.string().optional(),
  desc: Joi.boolean().optional(),
}).required();

const supervisorCreate = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  status: Joi.boolean().required(),
}).required();

const supervisorEdit = Joi.object({
  id: Joi.string().required(),
  username: Joi.string().optional(),
  password: Joi.string().optional(),
  status: Joi.boolean().optional(),
}).required();

export default {
  AdminCreate,
  login,
  verify,
  adminUpdate,
  get,
  getProfile,
  updateImageProfile,
  getBySupervisor,
  supervisorCreate,
  supervisorEdit,
};
