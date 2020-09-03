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
import { BTData, initBTData } from '../types/BTData';
import { MoveDirection } from '../types/MoveDirection';
import { HttpError } from './handlers';
import { WebSocketServer } from './WebSocketServer';
import { ISnake } from './snakes/snake-interface';

export interface ServerMoveResponse {
    move: MoveDirection,
    // Max 256 characters
    shout?: string,
}

export interface Snake {
    server: Server,
    info: any,
    start: (data: BTData) => void,
    move: (data: BTData) => ServerMoveResponse,
}

export class Server {
    public webSocketServer: WebSocketServer;

    constructor(
        private port: number,
        private snake: ISnake,
        private saveGame: boolean,
        private apiVersion: number,
        logHttp: boolean,
    ) {
        snake.server = this;
        this.webSocketServer = new WebSocketServer(this.port, snake);

        const app = express();
        app.set('port', this.port);

        app.enable('verbose errors');

        if (logHttp)  {
            app.use(logger('dev'));
        }
        app.use(bodyParser.json());

        app.get('/', (request: Request, response: Response) => {
            try {
                log('ping', this.snake.constructor.name);
                return response.json({
                    apiversion: '1',
                    author: 'petah',
                    color: this.snake.color,
                    head: this.snake.headType,
                    tail: this.snake.tailType,
                    name: this.snake.constructor.name,
                });
            } catch (e) {
                console.error(e);
            }
        });

        app.post('/start', (request: Request, response: Response) => {
            try {
                log('start', this.snake.constructor.name);
                this.snake.start(request.body);

                if (this.saveGame) {
                    writeFile(request.body.game.id, request.body.you.id, 'start', {
                        body: request.body,
                        logs,
                    });
                }
                this.webSocketServer.broadcast('start', {
                    snake: snake.info,
                    body: request.body,
                });

                logs.splice(0, logs.length);
                if (this.apiVersion === 0) {
                    return response.json({
                        color: this.snake.color,
                        headType: this.snake.headType,
                        tailType: this.snake.tailType,
                    });
                } else if (this.apiVersion === 1) {
                    return response.json();
                }
            } catch (e) {
                console.error(e);
            }
        });

        app.post('/move', (request: Request, response: Response) => {
            try {
                log('move', this.snake.constructor.name);
                const data: BTData = initBTData(request.body);
                const moveResponse = this.snake.move(data);

                if (this.apiVersion === 0) {
                    log('moveResponse', moveResponse);
                } else if (this.apiVersion === 1) {
                    // Invert Y axis for api version 1
                    if (moveResponse.move === MoveDirection.UP) {
                        moveResponse.move = MoveDirection.DOWN;
                    } else if (moveResponse.move === MoveDirection.DOWN) {
                        moveResponse.move = MoveDirection.UP;
                    }
                    log('moveResponseV2', moveResponse);
                }

                if (this.saveGame) {
                    writeFile(request.body.game.id, request.body.you.id, 'move', {
                        body: request.body,
                        logs,
                    });
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
                    writeFile(request.body.game.id, request.body.you.id, 'end', {
                        body: request.body,
                        logs,
                    });
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
                return response.json();
            } catch (e) {
                console.error(e);
            }
        });

        // Catchall
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
