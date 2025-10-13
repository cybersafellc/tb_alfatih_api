import { database } from "../app/database.js";
import { ResponseError } from "../errors/response-error.js";
import { Response } from "../utils/utils.js";
import tahapValidation from "../validations/tahap.validation.js";
import { validation } from "../validations/validation.js";

async function create(request) {
  const result = await validation(tahapValidation.create, request);
  const count = await database.tahap.count({
    where: {
      numbers: result.numbers,
    },
  });
  if (count)
    throw new ResponseError(400, "tahap " + result.numbers + " sudah ada");

  result.id = crypto.randomUUID();
  const responseCreate = await database.tahap.create({
    data: result,
  });
  return new Response(
    200,
    "berhasil menambahkan tahap " + result.numbers,
    responseCreate,
    null,
    false
  );
}

async function get(request) {
  const result = await validation(tahapValidation.get, request);
  let response;
  let custom_data = {};
  if (result.id) {
    response = await database.tahap.findUnique({
      where: {
        id: result.id,
      },
    });
    if (!response) throw new ResponseError(400, "tahap tidak ditemukan");
    return new Response(200, "list tahap", response, null, false);
  } else {
    const total_user = await database.tahap.count({
      where: {
        OR: [
          {
            title: {
              contains: result.search || "",
            },
          },
          {
            details: {
              contains: result.search || "",
            },
          },
        ],
      },
    });
    response = await database.tahap.findMany({
      orderBy: {
        numbers: result?.desc ? "desc" : "asc",
      },
      where: {
        OR: [
          {
            title: {
              contains: result.search || "",
            },
          },
          {
            details: {
              contains: result.search || "",
            },
          },
        ],
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

export default { create, get };
