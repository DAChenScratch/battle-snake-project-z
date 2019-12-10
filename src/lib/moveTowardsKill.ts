import { log } from './log';
import { BTData } from '../types/BTData';
import { Pather } from './Pather';

export function moveTowardsKill(data: BTData) {
    const pather = new Pather(data, false);
    const closest = {
        snake: null,
        path: null,
    };
    for (const snake of data.board.snakes) {
        if (snake.id == data.you.id) {
            continue;
        }
        if (snake.body.length >= data.you.body.length) {
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
            log('moveTowardsKill', direction);
            return direction;
        } else {
            log('moveTowardsKill', 'no direction');
        }
    } else {
        log('moveTowardsKill', 'no closest');
    }
    log('moveTowardsKill', 'no options');
}
