const bodyParser = require('body-parser');
const express = require('express');
const logger = require('morgan');
const {
    notFoundHandler,
    genericErrorHandler,
    poweredByHandler
} = require('./handlers');

import { Request, Response } from 'express';

import { log, logs } from '../lib/log';
import { writeFile } from '../lib/writeFile';
import { BTData } from '../types/BTData';
import { MoveDirection } from '../types/MoveDirection';
import { Color } from '../types/Color';
import { HeadType } from '../types/HeadType';
import { TailType } from '../types/TailType';
import { dataToInput } from '../nn/nn-bt-data-grid';
import { moveToOutput } from '../nn/nn-bt-data';
import { HttpError } from './handlers';

export interface ServerStartResponse {
    color: Color,
    headType: HeadType,
    tailType: TailType,
}

export interface ServerMoveResponse {
    move: MoveDirection,
}

export interface Snake {
    start: (data: BTData) => ServerStartResponse,
    move: (data: BTData) => ServerMoveResponse,
}

const clone = (data) => {
    return JSON.parse(JSON.stringify(data));
};

export class Server {
    private gameLog = {};

    constructor(
        private port: number,
        private snake: Snake,
        private saveGame: boolean,
    ) {
        const app = express();
        app.set('port', this.port);

        app.enable('verbose errors');

        app.use(logger('dev'));
        app.use(bodyParser.json());
        app.use(poweredByHandler);

        app.post('/start', (request: Request, response: Response) => {
            try {
                log('start', this.snake.constructor.name);
                const startResponse = this.snake.start(request.body);
                log('startResponse', startResponse);

                if (this.saveGame) {
                    request.body.log = clone(logs);
                    this.gameLog[request.body.you.id] = {
                        start: request.body,
                        moves: [],
                        trainingData: [],
                    };
                }

                logs.splice(0, logs.length);
                return response.json(startResponse);
            } catch (e) {
                console.error(e);
            }
        });

        app.post('/move', (request: Request, response: Response) => {
            try {
                log('move', this.snake.constructor.name);
                const moveResponse = this.snake.move(request.body);
                log('moveResponse', moveResponse);

                // const trainingData = {
                //     input: dataToInput(request.body),
                //     output: moveToOutput(moveResponse),
                // }

                if (this.saveGame) {
                    request.body.log = clone(logs);
                    this.gameLog[request.body.you.id].moves[request.body.turn] = request.body;
                    // this.gameLog[request.body.you.id].trainingData[request.body.turn] = trainingData;
                }

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
                    ${this.snake.constructor.name}<br/>
                    Battlesnake documentation can be found at
                    <a href="https://docs.battlesnake.io">https://docs.battlesnake.io</a>.
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
