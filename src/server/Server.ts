const bodyParser = require('body-parser');
const express = require('express');
const logger = require('morgan');
const {
    notFoundHandler,
    genericErrorHandler,
} = require('./handlers');

import { Request, Response } from 'express';

import { log, logs } from '../lib/log';
import { writeFile } from '../lib/writeFile';
import { BTData } from '../types/BTData';
import { MoveDirection } from '../types/MoveDirection';
import { Color } from '../types/Color';
import { HeadType } from '../types/HeadType';
import { TailType } from '../types/TailType';
import { HttpError } from './handlers';
import { WebSocketServer } from './WebSocketServer';

export interface ServerStartResponse {
    color: Color,
    headType: HeadType,
    tailType: TailType,
}

export interface ServerMoveResponse {
    move: MoveDirection,
}

export interface Snake {
    server: Server,
    info: any,
    start: (data: BTData) => ServerStartResponse,
    move: (data: BTData) => ServerMoveResponse,
}

const clone = (data) => {
    return JSON.parse(JSON.stringify(data));
};

export class Server {
    private gameLog = {};

    public webSocketServer: WebSocketServer;

    constructor(
        private port: number,
        private snake: Snake,
        private saveGame: boolean,
    ) {
        snake.server = this;
        this.webSocketServer = new WebSocketServer(this.port, snake);

        const app = express();
        app.set('port', this.port);

        app.enable('verbose errors');

        app.use(logger('dev'));
        app.use(bodyParser.json());

        app.post('/start', (request: Request, response: Response) => {
            try {
                log('start', this.snake.constructor.name);
                const startResponse = this.snake.start(request.body);
                log('startResponse', startResponse);

                if (this.saveGame) {
                    request.body.log = clone(logs);
                    this.gameLog[request.body.you.id] = {
                        snake: snake.constructor.name,
                        start: request.body,
                        moves: [],
                    };
                }
                this.webSocketServer.broadcast('start', {
                    snake: snake.info,
                    body: request.body,
                });

                logs.splice(0, logs.length);
                return response.json(startResponse);
            } catch (e) {
                console.error(e);
            }
        });

        app.post('/move', (request: Request, response: Response) => {
            try {
                log('move', this.snake.constructor.name);
                const data: BTData = request.body;
                data.cache = {};
                const moveResponse = this.snake.move(data);
                log('moveResponse', moveResponse);

                if (this.saveGame) {
                    delete data.cache;
                    request.body.log = clone(logs);
                    this.gameLog[request.body.you.id].moves[request.body.turn] = request.body;
                }

                this.webSocketServer.broadcast('move', {
                    snake: snake.info,
                    body: request.body,
                });

                logs.splice(0, logs.length);
                return response.json(moveResponse);
            } catch (e) {
                console.error(e);
            }
        });

        app.post('/end', (request: Request, response: Response) => {
            try {
                log('end', this.snake.constructor.name);
                if (this.saveGame) {
                    this.gameLog[request.body.you.id].end = request.body;
                    writeFile(request.body.you.id, this.gameLog[request.body.you.id]);
                    delete this.gameLog[request.body.you.id];
                }

                this.webSocketServer.broadcast('end', {
                    snake: snake.info,
                    body: request.body,
                });

                return response.json({});
            } catch (e) {
                console.error(e);
            }
        });

        app.post('/ping', (request: Request, response: Response) => {
            try {
                log('ping', this.snake.constructor.name);
                return response.json({});
            } catch (e) {
                console.error(e);
            }
        });

        app.use('*', (req: Request, res: Response, next: (next?: any) => void) => {
            console.dir(req.baseUrl);
            // Root URL path
            if (req.baseUrl === '') {
                res.status(200);
                return res.send(`
                    <link href="https://fonts.googleapis.com/css?family=Roboto:100i&display=swap" rel="stylesheet">
                    <style>
                        body {
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            text-align: center;
                            font-family: 'Roboto', sans-serif;
                            font-weight: 300;
                            font-size: 32px;
                            color: #444;
                        }
                    </style>
                        <h1>${this.snake.constructor.name}</h1>
                `);
            }

            // Short-circuit favicon requests
            if (req.baseUrl === '/favicon.ico') {
                res.set({ 'Content-Type': 'image/x-icon' });
                res.status(200);
                res.end();
                return next();
            }

            // Reroute all 404 routes to the 404 handler
            const err = new Error() as HttpError;
            err.status = 404;
            return next(err);
        });
        app.use(notFoundHandler);
        app.use(genericErrorHandler);

        app.listen(app.get('port'), () => {
            console.log('Server listening on port %s', app.get('port'))
        });
    }
}
