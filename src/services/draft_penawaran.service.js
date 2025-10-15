import { database } from "../app/database.js";
import { ResponseError } from "../errors/response-error.js";
import { Response } from "../utils/utils.js";
import draft_penawaranValidation from "../validations/draft_penawaran.validation.js";
import { validation } from "../validations/validation.js";

async function create(request) {
  const result = await validation(draft_penawaranValidation.create, request);
  const countProduct = await database.products.count({
    where: {
      id: result.product_id,
    },
  });
  if (!countProduct) throw new ResponseError(400, "product_id tidak valid");
  result.id = crypto.randomUUID();
  const responseCreate = await database.products.create({
    data: result,
  });
  return new Response(
    200,
    "berhasil menambahkan product",
    responseCreate,
    null,
    false
  );
}

export default { create };
