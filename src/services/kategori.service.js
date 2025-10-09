import { database } from "../app/database.js";
import { ResponseError } from "../errors/response-error.js";
import { Response } from "../utils/utils.js";
import kategoriValidation from "../validations/kategori.validation.js";
import { validation } from "../validations/validation.js";

async function create(request) {
  const result = await validation(kategoriValidation.create, request);
  const count = await database.tahap.count({
    where: {
      id: result.tahap_id,
    },
  });
  if (!count)
    throw new ResponseError(400, "tahap_id yang anda berikan tidak ada");
  const count1 = await database.kategori.count({
    where: {
      tahap_id: result.tahap_id,
      name: result.name,
    },
  });
  if (count1) throw new ResponseError(400, "kategori tersebut sudah ada");
  result.id = crypto.randomUUID();
  const responseCreate = await database.kategori.create({
    data: result,
  });
  return new Response(
    200,
    "berhasil menambahkan kategori baru",
    responseCreate,
    null,
    false
  );
}

async function get(request) {
  const result = await validation(kategoriValidation.get, request);
  let response;
  let custom_data = {};
  if (result.id) {
    response = await database.kategori.findUnique({
      where: {
        id: result.id,
      },
    });
    if (!response) throw new ResponseError(400, "kategori tidak ditemukan");
    return new Response(200, "list kategori", response, null, false);
  } else {
    const total_user = await database.kategori.count();
    response = await database.kategori.findMany({
      orderBy: {
        updated_at: result?.desc ? "desc" : "asc",
      },
      where: {
        tahap_id: result?.tahap_id || undefined,
        OR: [
          {
            name: {
              contains: result?.search || "",
            },
          },
          {
            tahap: {
              details: {
                contains: result?.search || "",
              },
            },
          },
          {
            tahap: {
              title: {
                contains: result?.search || "",
              },
            },
          },
        ],
      },
      include: {
        tahap: true,
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
      "list tahap",
      { data: response, pagination: custom_data },
      null,
      false
    );
  }
}

async function update(request) {
  const result = await validation(kategoriValidation.update, request);
  const countId = await database.kategori.count({
    where: {
      id: result.id,
    },
  });
  if (!countId) throw new ResponseError(400, "kategori id tersebut tidak ada");
  const countTahapid = await database.tahap.count({
    where: {
      id: result.tahap_id,
    },
  });
  if (!countTahapid)
    throw new ResponseError(400, "tahap_id tersebut tidak ada");

  const responseUpdate = await database.kategori.update({
    data: {
      tahap_id: result.tahap_id,
      name: result.name,
    },
    where: {
      id: result.id,
    },
    include: {
      tahap: true,
    },
  });

  return new Response(
    200,
    "berhasil mengupdate kategori",
    responseUpdate,
    null,
    false
  );
}

export default { create, get, update };
