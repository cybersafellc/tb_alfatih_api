import { database } from "../app/database.js";
import { Response } from "../utils/utils.js";
import reviewsValidation from "../validations/reviews.validation.js";
import { validation } from "../validations/validation.js";
import { ResponseError } from "../errors/response-error.js";

async function create(request) {
  const result = await validation(reviewsValidation.create, request);
  result.id = crypto.randomUUID();
  const responseCreate = await database.reviews.create({
    data: result,
  });
  return new Response(
    200,
    "berhasil mengirim ulasan",
    responseCreate,
    null,
    false
  );
}

async function get(request) {
  const result = await validation(reviewsValidation.get, request);
  let response;
  let custom_data = {};
  if (result.id) {
    response = await database.reviews.findUnique({
      where: {
        id: result.id,
      },
    });
    if (!response) throw new ResponseError(400, "reviews tidak ditemukan");
    return new Response(200, "list reviews", response, null, false);
  } else {
    const total_user = await database.reviews.count({
      where: {
        OR: [
          {
            nama: {
              contains: result.search || "",
            },
          },
          {
            comment: {
              contains: result.search || "",
            },
          },
        ],
      },
    });
    response = await database.reviews.findMany({
      orderBy: {
        updated_at: result?.desc ? "desc" : "asc",
      },
      where: {
        OR: [
          {
            nama: {
              contains: result.search || "",
            },
          },
          {
            comment: {
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
      "list reviews",
      { data: response, pagination: custom_data },
      null,
      false
    );
  }
}

export default { create, get };
