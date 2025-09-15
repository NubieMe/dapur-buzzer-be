import type { Prisma } from "@prisma/client";
import { config } from "../config";
import { createSchema, updateSchema } from "../helper/schema";
import { orderValidator } from "../helper/validator";
import { ResponseError } from "../lib/error";
import { prisma } from "../lib/prisma";
import fs from "fs"

export async function getAll(query: FilterQuery) {
  const { page, limit, order, search } = query
  const skip = (page - 1) * limit;
  const take = limit;

  const orderBy = orderValidator(order)

  const where: Prisma.InfluencerWhereInput = {}
  if (search) {
    where.OR = [
      {
        name: {
          contains: search as string,
        },
        username: {
          contains: search as string,
        },
      }
    ]

    const numberSearch = Number(search);
    if (!isNaN(numberSearch)) {
      where.OR.push({
        followers: numberSearch,
      })
    }
  }

  const [total, data] = await Promise.all([
    prisma.influencer.count({
      where
    }),
    prisma.influencer.findMany({
      where,
      take,
      skip,
      orderBy,
    }),
  ])

  return { data, total }
}

export async function getOne(id: number) {
  const data = await prisma.influencer.findUnique({
    where: { id }
  })

  if (!data) {
    throw new ResponseError('Influencer Not Found', 404)
  }

  return data
}

export async function create(body: InfluencerBody) {
  const data = createSchema.parse(body);

  return await prisma.influencer.create({
    data,
  });
}

export async function update(id: number, body: Partial<InfluencerBody>) {
  if (!body) {
    throw new ResponseError("No data to update", 400);
  }

  const data = updateSchema.parse(body) as Partial<InfluencerBody>

  const existing = await prisma.influencer.findFirst({
    where: { id },
    select: { image: true },
  })

  if (!existing) {
    throw new ResponseError('Influencer Not Found', 404)
  }

  if (data.image) {
    fs.unlinkSync(`uploads/${existing.image}`)
  }

  return await prisma.influencer.update({
    where: { id },
    data,
  });
}

export async function destroy(id: number) {
  const count = await prisma.influencer.count({
    where: { id }
  })

  if (count < 1) {
    throw new ResponseError('Influencer Not Found', 404)
  }

  const data = await prisma.influencer.delete({
    where: { id }
  })

  fs.unlinkSync(`uploads/${data.image}`)

  return data
}

export async function forwarder(username: string) {
  if (!username) {
    throw new ResponseError('username cannot be empty', 400)
  }

  const resp = await fetch(config.API_URL, {
    headers: {
      'X-RapidAPI-Host': config.API_HOST,
      'X-RapidAPI-Key': config.API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
    }),
    method: 'POST',
  })

  return await resp.json()
}