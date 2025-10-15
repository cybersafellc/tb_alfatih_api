import Joi from "joi";

const uploadProductImage = Joi.object({
  img_product: Joi.string().required(),
}).required();

const create = Joi.object({
  kategori_id: Joi.string().required(),
  type: Joi.string().valid("inti", "cross_selling").required(),
  name: Joi.string().required(),
  jenis: Joi.string().required(),
  prioritas_upselling: Joi.boolean().default(false),
  harga_jual: Joi.number().default(0),
  kondisi_peruntukan: Joi.string().default("-"),
  spesifikasi: Joi.string().default("-"),
  img_product: Joi.array().optional(),
  cross_selling_id: Joi.array().optional(),
}).required();

const get = Joi.object({
  id: Joi.string().optional(),
  type: Joi.string().optional(),
  tahap_id: Joi.string().optional(),
  kategori_id: Joi.string().optional(),
  page: Joi.number().optional(),
  items_per_page: Joi.number().optional(),
  search: Joi.string().optional(),
  desc: Joi.boolean().optional(),
}).required();

export default { uploadProductImage, create, get };
