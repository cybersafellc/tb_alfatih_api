import Jwt from "jsonwebtoken";
import { ResponseError } from "../errors/response-error.js";
import { database } from "../app/database.js";

async function allRole(req, res, next) {
  try {
    const access_token =
      (await req.headers["authorization"]?.split(" ")[1]) ||
      req.cookies["access_token"];

    const decode = await Jwt.verify(
      access_token,
      process.env.AUTH_TOKEN,
      function (err, decode) {
        return decode;
      }
    );
    if (!decode) throw new ResponseError(400, "akses token tidak valid");
    const user = await database.pengguna.findUnique({
      where: {
        id: decode.id,
      },
    });
    if (!user || !user.status)
      throw new ResponseError(400, "akun anda dikunci");

    // validation role disini

    //
    req.user_id = decode.id;
    req.role = decode.role;

    next();
  } catch (error) {
    next(error);
  }
}

async function adminAndSupervisor(req, res, next) {
  try {
    const access_token =
      (await req.headers["authorization"]?.split(" ")[1]) ||
      req.cookies["access_token"];

    const decode = await Jwt.verify(
      access_token,
      process.env.AUTH_TOKEN,
      function (err, decode) {
        return decode;
      }
    );
    if (!decode) throw new ResponseError(400, "akses token tidak valid");
    const user = await database.pengguna.findUnique({
      where: {
        id: decode.id,
      },
    });
    if (!user || !user.status)
      throw new ResponseError(400, "akun anda dikunci");

    // validation role disini
    if (user.role == "admin" || user.role == "supervisor") {
      req.user_id = user.id;
      req.role = user.role;
      next();
    } else {
      throw new ResponseError(403, "akses ditolak");
    }
    //
  } catch (error) {
    next(error);
  }
}

async function adminAndStaff(req, res, next) {
  try {
    const access_token =
      (await req.headers["authorization"]?.split(" ")[1]) ||
      req.cookies["access_token"];

    const decode = await Jwt.verify(
      access_token,
      process.env.AUTH_TOKEN,
      function (err, decode) {
        return decode;
      }
    );
    if (!decode) throw new ResponseError(400, "akses token tidak valid");
    const user = await database.pengguna.findUnique({
      where: {
        id: decode.id,
      },
    });
    if (!user || !user.status)
      throw new ResponseError(400, "akun anda dikunci");

    // validation role disini
    if (user.role == "admin" || user.role == "staff") {
      req.user_id = user.id;
      req.role = user.role;
      next();
    } else {
      throw new ResponseError(403, "akses ditolak");
    }
    //
  } catch (error) {
    next(error);
  }
}

async function adminRole(req, res, next) {
  try {
    const access_token =
      (await req.headers["authorization"]?.split(" ")[1]) ||
      req.cookies["access_token"];

    const decode = await Jwt.verify(
      access_token,
      process.env.AUTH_TOKEN,
      function (err, decode) {
        return decode;
      }
    );
    if (!decode) throw new ResponseError(400, "akses token tidak valid");
    const user = await database.pengguna.findUnique({
      where: {
        id: decode.id,
      },
    });
    if (!user || !user.status)
      throw new ResponseError(400, "akun anda dikunci");

    // validation role disini
    if (user.role == "admin") {
      req.user_id = user.id;
      req.role = user.role;
      next();
    } else {
      throw new ResponseError(403, "akses ditolak");
    }
    //
  } catch (error) {
    next(error);
  }
}

async function supervisorRole(req, res, next) {
  try {
    const access_token =
      (await req.headers["authorization"]?.split(" ")[1]) ||
      req.cookies["access_token"];

    const decode = await Jwt.verify(
      access_token,
      process.env.AUTH_TOKEN,
      function (err, decode) {
        return decode;
      }
    );
    if (!decode) throw new ResponseError(400, "akses token tidak valid");
    const user = await database.pengguna.findUnique({
      where: {
        id: decode.id,
      },
    });
    if (!user || !user.status)
      throw new ResponseError(400, "akun anda dikunci");

    // validation role disini
    if (user.role == "supervisor") {
      req.user_id = user.id;
      req.role = user.role;
      next();
    } else {
      throw new ResponseError(403, "akses ditolak");
    }
    //
  } catch (error) {
    next(error);
  }
}

async function staffRole(req, res, next) {
  try {
    const access_token =
      (await req.headers["authorization"]?.split(" ")[1]) ||
      req.cookies["access_token"];

    const decode = await Jwt.verify(
      access_token,
      process.env.AUTH_TOKEN,
      function (err, decode) {
        return decode;
      }
    );
    if (!decode) throw new ResponseError(400, "akses token tidak valid");
    const user = await database.pengguna.findUnique({
      where: {
        id: decode.id,
      },
    });
    if (!user || !user.status)
      throw new ResponseError(400, "akun anda dikunci");

    // validation role disini
    if (user.role == "staff") {
      req.user_id = user.id;
      req.role = user.role;
      next();
    } else {
      throw new ResponseError(403, "akses ditolak");
    }
    //
  } catch (error) {
    next(error);
  }
}

export default {
  allRole,
  adminAndSupervisor,
  adminAndStaff,
  adminRole,
  supervisorRole,
  staffRole,
};
