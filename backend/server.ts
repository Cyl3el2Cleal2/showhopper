import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
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

        //CORS
        this.app.use(cors());

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
            // logging: true,
        }).then((con)=>{
            console.log('Server is connected to Database')
        })
    }

    listen() {
        this.app.listen(config.SERVER_PORT, () => {
            console.log('Server is listenning on port', config.SERVER_PORT)
        })
    }
}

const app = new Server();
app.listen();