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

export default { create };
