import { database } from "../app/database.js";
import { ResponseError } from "../errors/response-error.js";
import { Response } from "../utils/utils.js";
import productValidation from "../validations/product.validation.js";
import { validation } from "../validations/validation.js";

async function uploadProductImage(request) {
  const result = await validation(
    productValidation.uploadProductImage,
    request
  );
  return new Response(200, "berhasil upload image", result, null, false);
}

async function create(request) {
  const result = await validation(productValidation.create, request);
  // check kategori valid
  const countKategori = await database.kategori.count({
    where: {
      id: result.kategori_id,
    },
  });
  if (!countKategori) throw new ResponseError(400, "kategori tidak ada");

  const checkAlreadyExist = await database.products.count({
    where: {
      jenis: result.jenis,
      name: result.name,
      kategori_id: result.kategori_id,
      type: result.type,
    },
  });
  if (checkAlreadyExist)
    throw new ResponseError(400, `product ${result.type} sudah ada`);

  if (result.type === "cross_selling") {
    result.id = crypto.randomUUID();
    result.ditolak = false;
    result.diproses = true;
    result.diterima = false;

    const responseCreate = await database.products.create({
      data: {
        id: result.id,
        name: result.name,
        type: result.type,
        jenis: result.jenis,
        prioritas_upselling: result.prioritas_upselling,
        harga_jual: result.harga_jual,
        kondisi_peruntukan: result.kondisi_peruntukan,
        spesifikasi: result.spesifikasi,
        kategori_id: result.kategori_id,
        ditolak: result.ditolak,
        diterima: result.diterima,
        diproses: result.diproses,
      },
    });

    if (result?.img_product?.length > 0) {
      for (const img of result.img_product) {
        await database.img_products.create({
          data: {
            id: crypto.randomUUID(),
            product_id: responseCreate.id,
            path: img,
          },
        });
      }
    }
    const getUlang = await database.products.findUnique({
      where: {
        id: responseCreate.id,
      },
      include: {
        img_products: true,
        kategori: true,
      },
    });
    return new Response(
      200,
      "berhasil menambhakna product " + result.type,
      getUlang,
      null,
      false
    );
  } else {
    if (result?.cross_selling_id?.length !== 3)
      throw new ResponseError(400, "wajib memilih 3 product cross selling");

    for (const data of result.cross_selling_id) {
      const count = await database.products.count({
        where: {
          id: data,
          type: "cross_selling",
        },
      });
      if (!count)
        throw new ResponseError(
          400,
          `product id ${data} dengan type cross_selling tidak ada`
        );
    }

    result.id = crypto.randomUUID();
    result.ditolak = false;
    result.diproses = true;
    result.diterima = false;

    const responseCreate = await database.products.create({
      data: {
        id: result.id,
        name: result.name,
        type: result.type,
        jenis: result.jenis,
        prioritas_upselling: result.prioritas_upselling,
        harga_jual: result.harga_jual,
        kondisi_peruntukan: result.kondisi_peruntukan,
        spesifikasi: result.spesifikasi,
        kategori_id: result.kategori_id,
        ditolak: result.ditolak,
        diterima: result.diterima,
        diproses: result.diproses,
      },
    });

    for (const data of result.cross_selling_id) {
      await database.cross_selling_connection.create({
        data: {
          id: crypto.randomUUID(),
          product_inti_id: responseCreate.id,
          product_cross_selling_id: data,
        },
      });
    }

    if (result?.img_product[0]) {
      for (const img of result.img_product) {
        await database.img_products.create({
          data: {
            id: crypto.randomUUID(),
            product_id: responseCreate.id,
            path: img,
          },
        });
      }
    }

    const getUlang = await database.products.findUnique({
      where: {
        id: responseCreate.id,
      },
      include: {
        img_products: true,
        kategori: true,
        cross_selling_inti: {
          include: {
            product_cross_selling: true,
          },
        },
      },
    });
    return new Response(
      200,
      "berhasil menambhakna product " + result.type,
      getUlang,
      null,
      false
    );
  }
}

async function update(request) {
  const result = await validation(productValidation.update, request);
  const product = await database.products.findUnique({
    where: {
      id: result.id,
    },
  });
  if (!product) throw new ResponseError(400, "id product tidak valid");
  if (result?.kategori_id) {
    const count = await database.kategori.count({
      where: {
        id: result.kategori_id,
      },
    });
    if (!count) throw new ResponseError(400, "kategori id tidak valid");
  }

  //  validasi product already exist

  // validasi cross_selling
  if (result?.cross_selling_id?.length > 0 && product.type === "inti") {
    if (result.cross_selling_id.length !== 3)
      throw new ResponseError(400, "wajib mengirim 3 cross selling");

    for (const id_cross_selling of result.cross_selling_id) {
      const count = await database.products.count({
        where: {
          id: id_cross_selling,
          type: "cross_selling",
        },
      });
      if (!count)
        throw new ResponseError(
          400,
          "cross_selling_id " + id_cross_selling + " tidak valid"
        );
    }

    await database.cross_selling_connection.deleteMany({
      where: {
        id: result.id,
      },
    });

    for (const id_cross_selling of result.cross_selling_id) {
      await database.cross_selling_connection.create({
        data: {
          id: crypto.randomUUID(),
          product_inti_id: product.id,
          product_cross_selling_id: id_cross_selling,
        },
      });
    }
  }

  // validation image
  if (result?.img_product?.length > 0) {
    for (const pathImg of result.img_product) {
      const count = await database.img_products.count({
        where: {
          path: pathImg,
          product_id: product.id,
        },
      });
      if (!count) {
        await database.img_products.create({
          data: {
            id: crypto.randomUUID(),
            product_id: product.id,
            path: pathImg,
          },
        });
      }
    }
  }

  const responseUpdate = await database.products.update({
    where: {
      id: product.id,
    },
    data: {
      kategori_id: result?.kategori_id,
      name: result?.name,
      jenis: result?.jenis,
      prioritas_upselling: result?.prioritas_upselling,
      harga_jual: result?.harga_jual,
      kondisi_peruntukan: result?.kondisi_peruntukan,
      spesifikasi: result?.spesifikasi,
    },
  });

  return new Response(
    200,
    "berhasil mengupdate product",
    responseUpdate,
    null,
    false
  );
}

async function get(request) {
  const result = await validation(productValidation.get, request);
  let response;
  let custom_data = {};
  if (result.id) {
    response = await database.products.findUnique({
      where: {
        id: result.id,
      },
      include: {
        img_products: true,
        cross_selling_inti: {
          include: {
            product_cross_selling: true,
          },
        },
        kategori: {
          include: {
            tahap: true,
          },
        },
        draft_penawaran: true,
      },
    });
    if (!response) throw new ResponseError(400, "product tidak ditemukan");
    return new Response(200, "list product", response, null, false);
  } else {
    const total_user = await database.products.count({
      where: {
        type: result?.type || undefined,
        kategori: {
          tahap_id: result?.tahap_id || undefined,
        },
        kategori_id: result?.kategori_id || undefined,
        OR: [
          {
            name: {
              contains: result.search || "",
            },
          },
          {
            jenis: {
              contains: result.search || "",
            },
          },
          {
            kondisi_peruntukan: {
              contains: result.search || "",
            },
          },
          {
            spesifikasi: {
              contains: result.search || "",
            },
          },
        ],
      },
    });
    response = await database.products.findMany({
      orderBy: {
        updated_at: result?.desc ? "desc" : "asc",
      },
      where: {
        type: result?.type || undefined,
        kategori: {
          tahap_id: result?.tahap_id || undefined,
        },
        kategori_id: result?.kategori_id || undefined,
        OR: [
          {
            name: {
              contains: result.search || "",
            },
          },
          {
            jenis: {
              contains: result.search || "",
            },
          },
          {
            kondisi_peruntukan: {
              contains: result.search || "",
            },
          },
          {
            spesifikasi: {
              contains: result.search || "",
            },
          },
        ],
      },
      skip: ((result?.page || 1) - 1) * (result?.items_per_page || 10),
      take: result?.items_per_page || 10,
      include: {
        img_products: true,
        cross_selling_inti: {
          include: {
            product_cross_selling: {
              include: {
                img_products: true,
                kategori: {
                  include: {
                    tahap: true,
                  },
                },
              },
            },
          },
        },
        kategori: {
          include: {
            tahap: true,
          },
        },
        draft_penawaran: true,
      },
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
      "list product",
      { data: response, pagination: custom_data },
      null,
      false
    );
  }
}

async function deleteProductImage(request) {
  const result = await validation(
    productValidation.deleteProductImage,
    request
  );
  const countImg = await database.img_products.count({
    where: {
      id: result.id,
    },
  });
  if (!countImg) throw new ResponseError(400, "id gambar tidak valid");
  const responseDelete = await database.img_products.delete({
    where: {
      id: result.id,
    },
  });
  return new Response(
    200,
    "berhasil menghapus gambar",
    responseDelete,
    null,
    false
  );
}

export default { uploadProductImage, create, get, deleteProductImage, update };
