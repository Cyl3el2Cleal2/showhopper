import { NextFunction, RequestHandler, Router, Request, Response } from "express";

const router = Router();

const routes = {
    'disney': require('./disney'),
}

function makeHandler(handler: RequestHandler) {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            await handler(req, res, next);
        } catch (error) {
            next(error);
        }
    }
}

for (const [routeName, routeController] of Object.entries(routes)) {
    if(routeController.getAll) {
        router.get(`/api/${routeName}`, makeHandler(routeController.getAll))
    }

    if(routeController.getById) {
        router.get(`/api/${routeName}/:id`, makeHandler(routeController.getById))
    }
}
export { router };