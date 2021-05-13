import { Equal, FindManyOptions, getRepository, In, Like, MoreThanOrEqual, Raw } from 'typeorm';
import { Request, Response } from 'express';
import { Disney } from '../entities/Disney';

async function getAll(req: Request, res: Response) {
    const filter: FindManyOptions<Disney> = {};

    filter.where = {};

    const take = Number(req.query.take) || 50;
    const skip = Number(req.query.skip) || 0;

    filter['take'] = take;
    filter['skip'] = skip;

    const title = req.query.title || null;
    if (title) {
        filter.where.title = Like(`%${title}%`)
    }

    const min_imdb = req.query.min_imdb || null;
    if (min_imdb) {
        filter.where.imdbRating = MoreThanOrEqual(Number(min_imdb));
    }
    const type = req.query.type || null;
    if (type) {
        filter.where.type = Equal(type);
    }

    const genre = req.query.genre || null;
    if (genre) {
        // filter.where.genre = Raw(alias => `(:...genre) IN ${alias}   `, {genre: genre.toString().split(' ').map((x)=>{return `{ ${x}}`})})
        filter.where.genre = Raw(alias => `${alias} @> :genre`, {genre: genre.toString().split(' ')})
    }

    const language = req.query.language || null;
    if (language) {
        // filter.where.language = Raw(alias => `(:...language) IN ${alias}   `, {language: language.toString().split(' ').map((x)=>{return `{ ${x}}`})})
        filter.where.language = Raw(alias => `${alias} @> :language`, {language: language.toString().split(' ')})
    }

    const [result, total] = await getRepository(Disney).findAndCount(filter)
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