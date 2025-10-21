import Joi from "joi";

const create = Joi.object({
  pengguna_id: Joi.string().required(),
  name: Joi.string().required(),
  alamat: Joi.string().required(),
  tanggal_janji_antar: Joi.string().required(),
  no_hp: Joi.string().required(),
  product: Joi.array()
    .items(
      Joi.object({
        product_id: Joi.string().required(),
        jumlah: Joi.number().greater(0).required(),
      })
    )
    .required(),
}).required();

const getSalesOrderByProfile = Joi.object({
  id: Joi.string().optional(),
  pengguna_id: Joi.string().required(),
  page: Joi.number().optional(),
  items_per_page: Joi.number().optional(),
  search: Joi.string().optional(),
  desc: Joi.boolean().optional(),
});

const deletes = Joi.object({
  id: Joi.string().required(),
  pengguna_id: Joi.string().required(),
});

export default { create, getSalesOrderByProfile, deletes };
