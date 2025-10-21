import { database } from "../app/database.js";
import { ResponseError } from "../errors/response-error.js";
import { Response } from "../utils/utils.js";
import penggunaValidation from "../validations/pengguna.validation.js";
import { validation } from "../validations/validation.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";

async function AdminCreate(request) {
  const result = await validation(penggunaValidation.AdminCreate, request);
  const count = await database.pengguna.count({
    where: {
      username: result.username,
    },
  });
  if (count) throw new ResponseError(400, "pengguna sudah ada");
  result.id = crypto.randomUUID();
  result.img_profile = "/img/profile/default-profile.png";
  result.password = await bcrypt.hash(result.password, 10);
  const responseCreate = await database.pengguna.create({
    data: result,
    select: {
      id: true,
      username: true,
      role: true,
      status: true,
    },
  });
  return new Response(
    200,
    "berhasil menambahkan user",
    responseCreate,
    null,
    false
  );
}

async function login(request) {
  const result = await validation(penggunaValidation.login, request);
  const user = await database.pengguna.findFirst({
    where: {
      username: result.username,
    },
  });
  if (user && (await bcrypt.compare(result.password, user.password))) {
    if (!user.status) throw new ResponseError(400, "akun anda dikunci");
    const access_token = await Jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.AUTH_TOKEN,
      {
        expiresIn: "8h",
      }
    );
    user.password = undefined;
    return new Response(
      200,
      "Berhasil masuk ke akun Kliksales",
      {
        access_token,
        user_details: user,
      },
      null,
      false
    );
  } else {
    throw new ResponseError(400, "password salah");
  }
}

async function verify(request) {
  const result = validation(penggunaValidation.verify, request);
  const user = await database.pengguna.findUnique({
    where: {
      id: result.user_id,
    },
    select: {
      id: true,
      username: true,
      role: true,
      status: true,
      img_profile: true,
      created_at: true,
      updated_at: true,
    },
  });
  return new Response(200, "akses token valid", user, null, false);
}

async function adminUpdate(request) {
  const result = await validation(penggunaValidation.adminUpdate, request);
  const count = await database.pengguna.count({
    where: {
      id: result.id,
    },
  });
  if (!count) throw new ResponseError(400, "akun ini tidak ditemukan");

  if (result.username) {
    const userNameCheck = await database.pengguna.count({
      where: {
        username: result.username,
        NOT: {
          id: result.id,
        },
      },
    });
    if (userNameCheck)
      throw new ResponseError(
        400,
        "username tersebut sudah dimiliki user yang lain"
      );
  }
  if (result.password) {
    result.password = await bcrypt.hash(result.password, 10);
  }
  const responseUpdate = await database.pengguna.update({
    data: result,
    where: {
      id: result.id,
    },
  });
  return new Response(
    200,
    "berhasil mengupdate akun user",
    responseUpdate,
    null,
    false
  );
}

async function get(request) {
  const result = await validation(penggunaValidation.get, request);
  let response;
  let custom_data = {};
  if (result.id) {
    response = await database.pengguna.findUnique({
      where: {
        id: result.id,
      },
    });
    if (!response) throw new ResponseError(400, "user tidak ditemukan");
    return new Response(200, "list user", response, null, false);
  } else {
    const total_user = await database.pengguna.count({
      where: {
        username: {
          contains: result.search || "",
        },
      },
    });
    response = await database.pengguna.findMany({
      orderBy: {
        updated_at: result?.desc ? "desc" : "asc",
      },
      where: {
        username: {
          contains: result.search || "",
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
      "list user",
      { data: response, pagination: custom_data },
      null,
      false
    );
  }
}

async function getProfile(request) {
  const result = await validation(penggunaValidation.getProfile, request);
  const profile = await database.pengguna.findUnique({
    where: {
      id: result.user_id,
    },
    select: {
      id: true,
      username: true,
      role: true,
      status: true,
      img_profile: true,
      created_at: true,
      updated_at: true,
    },
  });
  if (!profile) throw new ResponseError(400, "akun anda dikunci");
  return new Response(200, "profile", profile, null, false);
}

async function updateImageProfile(request) {
  const result = await validation(
    penggunaValidation.updateImageProfile,
    request
  );
  const count = await database.pengguna.count({
    where: {
      id: result.user_id,
    },
  });
  if (!count) throw new ResponseError(400, "akun anda dikucni");
  const updateResponse = await database.pengguna.update({
    data: {
      img_profile: "/img/profile/" + result.img_profile,
    },
    where: {
      id: result.user_id,
    },
  });
  return new Response(
    200,
    "berhasil mengupdate foto profile",
    updateResponse,
    null,
    false
  );
}

async function getBySupervisor(request) {
  const result = await validation(penggunaValidation.getBySupervisor, request);
  let response;
  let custom_data = {};
  if (result.id) {
    response = await database.pengguna.findUnique({
      where: {
        role: "staff",
        id: result.id,
      },
    });
    if (!response) throw new ResponseError(400, "user tidak ditemukan");
    return new Response(200, "list user", response, null, false);
  } else {
    const total_user = await database.pengguna.count({
      where: {
        role: "staff",
        username: {
          contains: result.search || "",
        },
      },
    });
    response = await database.pengguna.findMany({
      orderBy: {
        updated_at: result?.desc ? "desc" : "asc",
      },
      where: {
        role: "staff",
        username: {
          contains: result.search || "",
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
      "list user",
      { data: response, pagination: custom_data },
      null,
      false
    );
  }
}

async function supervisorCreate(request) {
  const result = await validation(penggunaValidation.supervisorCreate, request);
  const count = await database.pengguna.count({
    where: {
      username: result.username,
    },
  });
  if (count) throw new ResponseError(400, "pengguna sudah ada");
  result.id = crypto.randomUUID();
  result.img_profile = "/img/profile/default-profile.png";
  result.password = await bcrypt.hash(result.password, 10);
  result.role = "staff";
  const responseCreate = await database.pengguna.create({
    data: result,
    select: {
      id: true,
      username: true,
      role: true,
      status: true,
    },
  });
  return new Response(
    200,
    "berhasil menambahkan user",
    responseCreate,
    null,
    false
  );
}

async function supervisorEdit(request) {
  const result = await validation(penggunaValidation.supervisorEdit, request);
  const count = await database.pengguna.count({
    where: {
      id: result.id,
      role: "staff",
    },
  });
  if (!count) throw new ResponseError(400, "akun ini tidak ditemukan");

  if (result.username) {
    const userNameCheck = await database.pengguna.count({
      where: {
        username: result.username,
        NOT: {
          id: result.id,
        },
      },
    });
    if (userNameCheck)
      throw new ResponseError(
        400,
        "username tersebut sudah dimiliki user yang lain"
      );
  }
  if (result.password) {
    result.password = await bcrypt.hash(result.password, 10);
  }
  const responseUpdate = await database.pengguna.update({
    data: result,
    where: {
      id: result.id,
    },
  });
  return new Response(
    200,
    "berhasil mengupdate akun user",
    responseUpdate,
    null,
    false
  );
}

export default {
  AdminCreate,
  login,
  verify,
  adminUpdate,
  get,
  getProfile,
  updateImageProfile,
  getBySupervisor,
  supervisorCreate,
  supervisorEdit,
};
