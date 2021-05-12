import { getRepository, Like } from 'typeorm';
import { Request, Response } from 'express';
import { Disney } from '../entities/Disney';

async function getAll(req: Request, res: Response) {
    const take = Number(req.query.take) || 10;
    const skip = Number(req.query.skip) || 0;

    const filter = {};

    const title = req.query.title || null;
    if(title){
        filter['title'] = Like(`%${title}%`)
    }

    const [result, total] = await getRepository(Disney).findAndCount( {
        where: filter,
        take: take,
        skip: skip,
    } )
    return res.send({
        count: total,
        data: result,
    })
}

async function getById(req: Request, res: Response) {
    return res.send(await getRepository(Disney).findOne({ imdbId: req.params.id }))
}

export {
    getAll,
    getById,
}