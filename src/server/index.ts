const bodyParser = require('body-parser');
const express = require('express');
const logger = require('morgan');
const app = express();
const {
    fallbackHandler,
    notFoundHandler,
    genericErrorHandler,
    poweredByHandler
} = require('./handlers.js');

import { Request, Response } from 'express';

import { log } from '../lib/log';
import { writeFile } from '../lib/writeFile';
import { moveTowardsFood } from '../lib/moveTowardsFood';
import { randomMove } from '../lib/randomMove';
import { moveTowardsFoodPf } from '../lib/moveTowardsFoodPf';

app.set('port', (process.env.PORT || 9001));

app.enable('verbose errors');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(poweredByHandler);

app.post('/start', (request: Request, response: Response) => {
    log('start');
    try {
        writeFile(request.body, (json) => {
            json.start = request.body;
            json.moves = [];
        });
        // @todo random color
        return response.json({
            color: '#DFFF00',
        });
    } catch (e) {
        console.error(e);
    }
});

app.post('/move', (request: Request, response: Response) => {
    log('move');
    try {
        writeFile(request.body, (json) => {
            json.moves[request.body.turn] = request.body;
        });
        // log(request.body);
        const directions = ['up', 'down', 'left', 'right'];
        let direction;
        direction = moveTowardsFoodPf(request.body);
        if (direction === undefined) {
            direction = randomMove(request.body);
        }
        return response.json({
            move: directions[direction],
        });
    } catch (e) {
        console.error(e);
    }
});

app.post('/end', (request: Request, response: Response) => {
    log('end');
    return response.json({});
});

app.post('/ping', (request: Request, response: Response) => {
    log('ping');
    return response.json({});
});

app.use('*', fallbackHandler);
app.use(notFoundHandler);
app.use(genericErrorHandler);

app.listen(app.get('port'), () => {
    console.log('Server listening on port %s', app.get('port'))
});
