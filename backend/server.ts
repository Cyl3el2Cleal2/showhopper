import express from 'express';
import morgan from 'morgan';
import { createConnection } from 'typeorm';

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

        //use Router
        this.app.use(router);

        //connect DB
        this.connectDatabase();
    }

    connectDatabase() {
        createConnection({
            type: 'postgres',
            host: config.DB_HOST,
            port: Number(config.DB_PORT) || 5432,
            username: config.DB_USER,
            password: config.DB_PASS,
            database: config.DB_DATABASE,
            entities: [__dirname + '/entities/*'],
            synchronize: false,
            logging: true,
        })
    }

    listen() {
        this.app.listen(config.SERVER_PORT, () => {
            console.log('Server is listen on port', config.SERVER_PORT)
        })
    }
}

const app = new Server();
app.listen();