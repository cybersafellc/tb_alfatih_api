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
  const responseCreate = await database.draft_penawaran.create({
    data: result,
  });
  return new Response(
    200,
    "berhasil menambahkan draft penawaran",
    responseCreate,
    null,
    false
  );
}

async function update(request) {
  const result = await validation(draft_penawaranValidation.update, request);
  const countDP = await database.draft_penawaran.count({
    where: {
      id: result.id,
    },
  });
  if (!countDP) throw new ResponseError(400, "draft penawaran id tidak valid");
  if (result?.product_id) {
    const countProduct = await database.products.count({
      where: {
        id: result.product_id,
      },
    });
    if (!countProduct) throw new ResponseError(400, "product_id tidak valid");
  }
  const updateResponse = await database.draft_penawaran.update({
    data: result,
    where: {
      id: result.id,
    },
  });
  return new Response(
    200,
    "berhasil mengupdate draft penawaran",
    updateResponse,
    null,
    false
  );
}

async function deletes(request) {
  const result = await validation(draft_penawaranValidation.deletes, request);
  const count = await database.draft_penawaran.count({
    where: {
      id: result.id,
    },
  });
  if (!count) throw new ResponseError(400, "draft penawaran id tidak valid");
  const responseDelete = await database.draft_penawaran.delete({
    where: {
      id: result.id,
    },
  });
  return new Response(
    200,
    "berhasil menghapus draft penawaran",
    responseDelete,
    null,
    false
  );
}

export default { create, update, deletes };
