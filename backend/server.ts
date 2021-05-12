import express from 'express';
import morgan from 'morgan';

import { router } from './controller';

const config = process.env;

class Server {
    public app: express.Application;

    constructor() {
        this.initialize()
    }

    initialize() {
        //Express Instant
        this.app = express();

        //HTTP Log
        this.app.use(morgan('dev'));

        this.app.use(router);
    }

    listen() {
        this.app.listen(config.SERVER_PORT, () => {
            console.log('Server is listen on port', config.SERVER_PORT)
        })
    }
}

const app = new Server();
app.listen();