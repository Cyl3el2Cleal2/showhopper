import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { Disney } from '../entities/Disney';

async function getById(req: Request, res: Response) {
    const field = req.params.id

    const disney_type = req.query.type
    if (['language', 'genre', 'year'].includes(field) && disney_type) {
        const raw_result = await getRepository(Disney).createQueryBuilder().select(field).distinct(true).where("type = :type", { type: disney_type }).getRawMany();
        // console.log(result)

        //Format data for some field
        if (['language', 'genre'].includes(field)) {
            let format_result = []
            for (const [key, value] of Object.entries(raw_result)) {
                // console.log(value.genre)
                if (value[field] == null) {
                    continue
                }
                for (const genre of value[field]) {
                    if (genre == null) {
                        continue
                    }
                    if (format_result.includes(genre)) {
                        continue
                    }
                    format_result.push(genre)
                }
            }

            const result = {};
            result[field] = format_result.sort()
            return res.send(result)
        }

        else {
            const format_result = raw_result.map(val => {
                return val[field]
            })

            const result = {};
            result[field] = format_result.sort();
            return res.send(result)
        }
        return res.send(raw_result)
    }
    return res.status(404).send('Not found params type');
}

export {
    getById,
}