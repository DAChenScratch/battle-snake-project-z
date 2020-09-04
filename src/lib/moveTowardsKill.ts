import { log } from './log';
import { BTData, BTRequest } from '../types/BTData';
import { Pather } from './Pather';

export function moveTowardsKill(request: BTRequest) {
    const pather = new Pather(request, {
        blockHeads: false,
        attackHeads: true,
    });
    const closest = {
        snake: null,
        path: null,
    };
    for (const snake of request.body.board.snakes) {
        if (snake.id == request.body.you.id) {
            continue;
        }
        if (snake.body.length >= request.body.you.body.length) {
            continue;
        }
        const path = pather.pathTo(snake.body[0].x, snake.body[0].y);
        if (path.length && path.length <= 3) {
            if (!closest.path || path.length < closest.path.length) {
                closest.snake = snake;
                closest.path = path;
            }
        }
    }
    if (closest.path) {
        const direction = pather.pathToDirection(closest.path);
        if (direction) {
            request.log('moveTowardsKill', direction);
            return direction;
        } else {
            request.log('moveTowardsKill', 'no direction');
        }
    } else {
        request.log('moveTowardsKill', 'no closest');
    }
    request.log('moveTowardsKill', 'no options');
}
