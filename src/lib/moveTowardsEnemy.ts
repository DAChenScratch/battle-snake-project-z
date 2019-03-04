import { gridDistance } from './gridDistance';
import { log } from './log';
import { weight, BLOCKED_THRESHOLD } from './weight';
import { closestFood } from './closestFood';
import { BTData } from '../types/BTData';
import { sortedFood } from './sortedFood';
import { sortedEnemies } from './sortedEnemies';
import { MoveDirection } from '../types/MoveDirection';
import { Pather } from './Pather';

export function moveTowardsEnemy(data: BTData) {
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
