import dashboardValidation from "../validations/dashboard.validation.js";
import { validation } from "../validations/validation.js";
import { database } from "../app/database.js";
import { GenerateDateForSupervisor, Response } from "../utils/utils.js";

async function supervisorAktifitasStaff(request) {
  const result = await validation(
    dashboardValidation.supervisorAktifitasStaff,
    request
  );
  const total_data = await database.pengguna.count({
    where: {
      username: {
        contains: result.search,
      },
    },
  });
  const datas = await database.pengguna.findMany({
    where: {
      username: {
        contains: result.search,
      },
    },
    select: {
      id: true,
      username: true,
      updated_at: true,
      status: true,
      _count: {
        select: {
          sales_order: true,
        },
      },
    },
    orderBy: {
      sales_order: {
        _count: result.desc ? "desc" : "asc",
      },
    },
    skip: (result.page - 1) * result.items_per_page,
    take: result.items_per_page,
  });

  const dataResponse = {
    data: datas,
    pagination: {
      items_per_page: result.items_per_page,
      page: result.page,
      max_page: Math.ceil(total_data / result.items_per_page),
      search: result.search,
      total_data: total_data,
    },
  };

  return new Response(200, "list aktivitas staff", dataResponse, null, false);
}

async function supervisorGrafik(request) {
  const result = await validation(
    dashboardValidation.supervisorGrafik,
    request
  );
  const response = {
    filter: {
      key: result.filter_key,
      name: null,
    },
    interval: {
      data: [],
      counts: [],
      high_value: 0,
      max_kelipatan: 0,
      kelipatan: 0,
    },
  };

  switch (result.filter_key) {
    default:
      const date = new GenerateDateForSupervisor();
      const dateArray = [
        date.day6ago,
        date.day5ago,
        date.day4ago,
        date.day3ago,
        date.day2ago,
        date.day1ago,
        date.day0,
      ];
      //
      response.filter.name = "Minggu ini";
      for (const dateNyo of dateArray) {
        const tomorrow = new Date();
        tomorrow.setDate(dateNyo.getDate() + 1);
        const countData = await database.sales_order.count({
          where: {
            created_at: {
              gte: dateNyo,
              lte: tomorrow,
            },
          },
        });

        response.interval.data.push({
          day: dateNyo.toLocaleDateString("id-ID", { weekday: "long" }),
          total: countData,
        });
        if (countData > response.interval.high_value) {
          response.interval.high_value = countData;
        }
      }
  }

  response.interval.max_kelipatan =
    Math.ceil(response.interval.high_value / 10) * 10;
  response.interval.kelipatan = response.interval.max_kelipatan / 5;

  for (let i = 0; i < 6; i++) {
    response.interval.counts.push(response.interval.kelipatan * i);
  }

  return new Response(200, "lists data", response, null, false);
}

async function getProdukBaru() {
  const count = await database.products.count({
    where: {
      diproses: true,
    },
  });
  return new Response(
    200,
    "berhasil get total produk baru",
    { total: count },
    null,
    false
  );
}

export default { supervisorAktifitasStaff, supervisorGrafik, getProdukBaru };
