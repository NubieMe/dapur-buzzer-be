import type { NextFunction, Request, Response } from "express";
import { ResponseError } from "../lib/error";
import * as service from "../service/index";

export async function forwarder(req: Request, res: Response, next: NextFunction) {
  try {
    const { username, key } = req.query;

    if (key !== 'rahasia') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const data = await service.forwarder(username as string)

    return res.status(200).json({
      data: (data.result[0] || data.result[0].user) ? data.result[0].user : data
    });
  } catch (error) {
    next(error);
  }
}

export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      page = '1',
      limit = '10',
      order = 'created_at-desc',
      search = '',
    } = req.query;
    
    const numberPage = Number(page)
    const numberLimit = Number(limit)

    if (isNaN(numberPage) || isNaN(numberLimit)) {
      throw new ResponseError('Invalid query format', 400)
    }

    const { data, total } = await service.getAll({
      page: numberPage,
      limit: numberLimit,
      order: order as string,
      search: search as string,
    })

    return res.status(200).json({
      data,
      total,
    });
  } catch (error) {
    next(error)
  }
}

export async function getOne(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const numberId = Number(id);
    if (isNaN(numberId)) {
      throw new ResponseError('Invalid ID format', 400)
    }

    const data = await service.getOne(numberId)

    return res.status(200).json({
      data,
    });
  } catch (error) {
    next(error)
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      throw new ResponseError('Image is Required', 400)
    }
    req.body.image = req.file.filename
    const data = await service.create(req.body)

    return res.status(201).json({
      message: 'influencer created',
      data,
    });
  } catch (error) {
    next(error)
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const numberId = Number(id);
    if (isNaN(numberId)) {
      throw new ResponseError('Invalid ID format', 400)
    }

    const data = await service.update(numberId, req.body)

    return res.status(200).json({
      message: 'influencer updated',
      data,
    });
  } catch (error) {
    next(error)
  }
}

export async function destroy(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const numberId = Number(id);
    if (isNaN(numberId)) {
      throw new ResponseError('Invalid ID format', 404)
    }

    const data = await service.destroy(numberId)

    return res.status(200).json({
      message: 'influencer deleted',
      data,
    });
  } catch (error) {
    next(error)
  }
}