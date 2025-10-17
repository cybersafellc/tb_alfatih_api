import { database } from "../app/database.js";
import { ResponseError } from "../errors/response-error.js";
import { Response } from "../utils/utils.js";
import sales_orderValidation from "../validations/sales_order.validation.js";
import { validation } from "../validations/validation.js";

async function create(request) {
  const result = await validation(sales_orderValidation.create, request);
  // validation product
  if (result.product.length <= 0)
    throw new ResponseError(400, "product is required");

  const ids = result.product.map((p) => p.product_id);
  const isDuplicate = new Set(ids).size !== result.product.length;
  if (isDuplicate) throw new ResponseError(400, "product duplicate");

  for (const product of result.product) {
    const count = await database.products.count({
      where: {
        id: product.product_id,
      },
    });
    if (!count) throw new ResponseError(400, "terdapat product id tidak valid");
  }

  const createResponse = await database.sales_order.create({
    data: {
      id: crypto.randomUUID(),
      so_numbers: crypto.randomUUID(), // sementara menggunakan uuid dlu
      pengguna_id: result.pengguna_id,
      name: result.name,
      alamat: result.alamat,
      tanggal_janji_antar: new Date(result.tanggal_janji_antar),
      no_hp: result.no_hp,
      proses_hapus: false,
      disetuji_hapus: false,
    },
  });

  for (const product of result.product) {
    await database.details_sales_order.create({
      data: {
        id: crypto.randomUUID(),
        sales_order_id: createResponse.id,
        product_id: product.product_id,
        jumlah: product.jumlah,
      },
    });
  }

  const toResponse = await database.sales_order.findUnique({
    where: {
      id: createResponse.id,
    },
    include: {
      pengguna: true,
      details_sales_order: {
        include: {
          product: true,
        },
      },
    },
  });

  return new Response(
    200,
    "berhasil membuat sales order",
    toResponse,
    null,
    false
  );
}

export default { create };
