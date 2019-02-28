const bodyParser = require('body-parser');
const express = require('express');
const logger = require('morgan');
const app = express();
const {
    fallbackHandler,
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

interface ServerStartResponse {
    color: Color,
    headType: HeadType,
    tailType: TailType,
}

interface ServerMoveResponse {
    move: MoveDirection,
}

export class Server {
    constructor(
        private port: number,
        private start: (data: BTData) => ServerStartResponse,
        private move: (data: BTData) => ServerMoveResponse,
    ) {
        app.set('port', this.port);

        app.enable('verbose errors');

        app.use(logger('dev'));
        app.use(bodyParser.json());
        app.use(poweredByHandler);

        app.post('/start', (request: Request, response: Response) => {
            try {
                log('start');
                const startResponse = this.start(request.body);
                log('startResponse', startResponse);
                writeFile(request.body, (json) => {
                    request.body.log = logs;
                    json.start = request.body;
                    json.moves = [];
                });
                logs.splice(0, logs.length);
                return response.json(startResponse);
            } catch (e) {
                console.error(e);
            }
        });

        app.post('/move', (request: Request, response: Response) => {
            try {
                log('move');
                const moveResponse = this.move(request.body);
                log('moveResponse', moveResponse);
                writeFile(request.body, (json) => {
                    request.body.log = logs;
                    json.moves[request.body.turn] = request.body;
                });
                logs.splice(0, logs.length);
                return response.json(moveResponse);
            } catch (e) {
                console.error(e);
            }
        });

        app.post('/end', (request: Request, response: Response) => {
            try {
                log('end');
                return response.json({});
            } catch (e) {
                console.error(e);
            }
        });

        app.post('/ping', (request: Request, response: Response) => {
            try {
                log('ping');
                return response.json({});
            } catch (e) {
                console.error(e);
            }
        });

        app.use('*', fallbackHandler);
        app.use(notFoundHandler);
        app.use(genericErrorHandler);

        app.listen(app.get('port'), () => {
            console.log('Server listening on port %s', app.get('port'))
        });
    }
}
