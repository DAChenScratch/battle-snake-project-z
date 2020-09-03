import { log } from './log';
import { BTData } from '../types/BTData';
import { Pather } from './Pather';
import { isEnemy } from './isEnemy';

export function moveTowardsEnemy(data: BTData) {
    const pather = new Pather(data, false);
    const closest = {
        snake: null,
        path: null,
    };
    for (const snake of data.board.snakes) {
        if (!isEnemy(data.you, snake)) {
            continue;
        }
        if (snake.body.length >= data.you.body.length) {
            continue;
        }
        const path = pather.pathTo(snake.body[0].x, snake.body[0].y);
        if (path.length) {
            if (!closest.path || path.length < closest.path.length) {
                closest.snake = snake;
                closest.path = path;
            }
        }
    }
    if (closest.path) {
        const direction = pather.pathToDirection(closest.path);
        if (direction) {
            log('moveTowardsEnemy', direction);
            return direction;
        }
    }
    log('moveTowardsEnemy', 'no options');
}
