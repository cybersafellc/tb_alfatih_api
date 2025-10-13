import { database } from "../app/database.js";
import { ResponseError } from "../errors/response-error.js";
import { Response } from "../utils/utils.js";
import faqValidation from "../validations/faq.validation.js";
import { validation } from "../validations/validation.js";

async function create(request) {
  const result = await validation(faqValidation.create, request);
  const countTahap = await database.tahap.count({
    where: {
      id: result.tahap_id,
    },
  });
  if (!countTahap) throw new ResponseError(400, "tahap_id tidak ada");
  const countAE = await database.faq.count({
    where: {
      tahap_id: result.tahap_id,
      title: result.title,
    },
  });
  if (countAE) throw new ResponseError(400, "faq tersebut sudah ada");
  result.id = crypto.randomUUID();
  const responseCreate = await database.faq.create({
    data: result,
    include: {
      tahap: true,
    },
  });
  return new Response(
    200,
    "berhasil menambahkan faq",
    responseCreate,
    null,
    false
  );
}

async function update(request) {
  const result = await validation(faqValidation.update, request);
  const checkFaq = await database.faq.findUnique({
    where: {
      id: result.id,
    },
  });
  if (!checkFaq) throw new ResponseError(400, "id faq tidak ada");
  if (result?.tahap_id) {
    const count = await database.tahap.count({
      where: {
        id: result.tahap_id,
      },
    });
    if (!count) throw new ResponseError(400, "tahap_id tidak ada");
  }
  if (result?.tahap_id || result?.title) {
    if (
      result.title !== checkFaq.title ||
      result.tahap_id !== checkFaq.tahap_id
    ) {
      const checkAlreadyExist = await database.faq.count({
        where: {
          tahap_id: result?.tahap_id || checkFaq.tahap_id,
          title: result?.title || checkFaq.title,
        },
      });
      if (checkAlreadyExist)
        throw new ResponseError(400, "faq tersebut sudah ada");
    }
  }
  const responseUpdate = await database.faq.update({
    data: result,
    where: {
      id: result.id,
    },
    include: {
      tahap: true,
    },
  });
  return new Response(
    200,
    "berhasil mengupdate faq",
    responseUpdate,
    null,
    false
  );
}

async function get(request) {
  const result = await validation(faqValidation.get, request);
  let response;
  let custom_data = {};
  if (result.id) {
    response = await database.faq.findUnique({
      where: {
        id: result.id,
      },
    });
    if (!response) throw new ResponseError(400, "faq tidak ditemukan");
    return new Response(200, "list faq", response, null, false);
  } else {
    const total_user = await database.faq.count({
      where: {
        tahap_id: result?.tahap_id || undefined,
        OR: [
          {
            title: {
              contains: result?.search || "",
            },
          },
          {
            details: {
              contains: result?.search || "",
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
    });
    response = await database.faq.findMany({
      orderBy: {
        updated_at: result?.desc ? "desc" : "asc",
      },
      where: {
        tahap_id: result?.tahap_id || undefined,
        OR: [
          {
            title: {
              contains: result?.search || "",
            },
          },
          {
            details: {
              contains: result?.search || "",
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
      "list faq",
      { data: response, pagination: custom_data },
      null,
      false
    );
  }
}

async function deletes(request) {
  const result = await validation(faqValidation.deletes, request);
  const count = await database.faq.count({
    where: {
      id: result.id,
    },
  });
  if (!count) throw new ResponseError(400, "faq tidak ada");
  const responseDelete = await database.faq.delete({
    where: {
      id: result.id,
    },
  });
  return new Response(
    200,
    "berhasil menghapus faq",
    responseDelete,
    null,
    false
  );
}

export default { create, update, get, deletes };
