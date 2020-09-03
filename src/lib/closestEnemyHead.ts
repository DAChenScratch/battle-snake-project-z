import { BTData, BTSnake } from '../types/BTData';
import { Pather, Path } from './Pather';
import { isEnemy } from './isEnemy';
import { MoveDirection } from '../types/MoveDirection';

interface ClosestEnemyHead {
    snake: BTSnake,
    path: Path,
    direction: MoveDirection,
}

export function closestEnemyHead(data: BTData): ClosestEnemyHead | null {
    const pather = new Pather(data, false);
    const closest: ClosestEnemyHead = {
        snake: null,
        path: null,
        direction: null,
    };
    for (const snake of data.board.snakes) {
        if (!isEnemy(data.you, snake)) {
            continue;
        }
        if (data.you.body.length > snake.body.length) {
            continue;
        }
        const path = pather.pathTo(snake.body[0].x, snake.body[0].y);
        if (path.length) {
            if (!closest.path || path.length < closest.path.length) {
                closest.snake = snake;
                closest.path = path;
                closest.direction = pather.pathToDirection(closest.path);
            }
        }
    }
    return closest.snake ? closest : null;
}
