import Joi from "joi";

const supervisorAktifitasStaff = Joi.object({
  page: Joi.number().default(1),
  items_per_page: Joi.number().default(10),
  search: Joi.string().default(""),
  desc: Joi.boolean().default(false),
}).required();

const supervisorGrafik = Joi.object({
  filter_key: Joi.string().default("week"),
}).required();

export default { supervisorAktifitasStaff, supervisorGrafik };
