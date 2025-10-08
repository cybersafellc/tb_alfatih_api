import { database } from "../app/database.js";
import { ResponseError } from "../errors/response-error.js";
import { Response } from "../utils/utils.js";
import penggunaValidation from "../validations/pengguna.validation.js";
import { validation } from "../validations/validation.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";

async function create(request) {
  const result = await validation(penggunaValidation.create, request);
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

    return new Response(
      200,
      "Berhasil masuk ke akun Kliksales",
      {
        access_token,
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

export default { create, login, verify };
