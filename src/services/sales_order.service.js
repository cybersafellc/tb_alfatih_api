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

async function getSalesOrderByProfile(request) {
  const result = await validation(
    sales_orderValidation.getSalesOrderByProfile,
    request
  );
  console.log(result);
  let response;
  let custom_data = {};
  if (result.id) {
    response = await database.sales_order.findUnique({
      where: {
        id: result.id,
        pengguna_id: result.pengguna_id,
      },
      include: {
        details_sales_order: {
          include: {
            product: true,
          },
        },
      },
    });
    if (!response) throw new ResponseError(400, "sales order tidak ditemukan");
    return new Response(200, "list sales order", response, null, false);
  } else {
    const total_user = await database.sales_order.count({
      where: {
        pengguna_id: result.pengguna_id,
        OR: [
          {
            so_numbers: {
              contains: result?.search || "",
            },
          },
          {
            name: {
              contains: result?.search || "",
            },
          },
          {
            alamat: {
              contains: result?.search || "",
            },
          },
          {
            no_hp: {
              contains: result?.search || "",
            },
          },
        ],
      },
    });
    response = await database.sales_order.findMany({
      orderBy: {
        updated_at: result?.desc ? "desc" : "asc",
      },
      where: {
        pengguna_id: result.pengguna_id,
        OR: [
          {
            so_numbers: {
              contains: result?.search || "",
            },
          },
          {
            name: {
              contains: result?.search || "",
            },
          },
          {
            alamat: {
              contains: result?.search || "",
            },
          },
          {
            no_hp: {
              contains: result?.search || "",
            },
          },
        ],
      },
      include: {
        details_sales_order: {
          include: {
            product: {
              include: {
                img_products: true,
              },
            },
          },
        },
      },
      skip: ((result?.page || 1) - 1) * (result?.items_per_page || 10),
      take: result?.items_per_page || 10,
    });

    custom_data.items_per_page = result.items_per_page || 10;
    custom_data.page = result.page || 1;
    custom_data.max_page = Math.ceil(
      total_user / (result.items_per_page || 10)
    );
    custom_data.search = result.search;
    custom_data.total_data = total_user;
    return new Response(
      200,
      "list sales order",
      { data: response, pagination: custom_data },
      null,
      false
    );
  }
}

async function deletes(request) {
  const result = await validation(sales_orderValidation.deletes, request);
  const count = await database.sales_order.count({
    where: result,
  });
  if (!count) throw new ResponseError(400, "sales order id tidak valid");
  const responseDelete = await database.sales_order.delete({
    where: result,
  });
  return new Response(
    200,
    "berhasil menghapus sales order",
    responseDelete,
    null,
    false
  );
}

export default { create, getSalesOrderByProfile, deletes };
