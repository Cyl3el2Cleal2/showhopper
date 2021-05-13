import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { Disney } from '../entities/Disney';

async function getById(req: Request, res: Response) {
    const field = req.params.id
    if (['type', 'language', 'genre'].includes(field)) {
        const raw_result = await getRepository(Disney).createQueryBuilder().select(field).distinct(true).getRawMany();
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

        //Format data for type
        if (field === 'type') {
            const format_result = raw_result.map(val => {
                return val.type
            })
            return res.send({
                type: format_result
            })
        }
        return res.send(raw_result)
    }
    return res.status(404).send();
}

export {
    getById,
}