import { gridDistance } from './gridDistance';
import { log } from './log';
import { weight } from './weight';
import { closestFood } from './closestFood';
import { BTData } from '../types/BTData';
import { sortedFood } from './sortedFood';
import { sortedEnemies } from './sortedEnemies';

const PF = require('pathfinding');

const pf = new PF.AStarFinder({
    allowDiagonal: false,
    useCost: true,
});

const BLOCKED = 1;
const FREE = 0;
const UP = 0;
const DOWN = 1;
const LEFT = 2;
const RIGHT = 3;

export function moveTowardsEnemy(data: BTData) {
    const matrix = [];
    const costs = [];
    for (var y = 0; y < data.board.height; y++) {
        matrix[y] = [];
        costs[y] = [];
        for (var x = 0; x < data.board.width; x++) {
            const w = weight(data, x, y);
            matrix[y][x] = w > 10 ? FREE : BLOCKED;
            costs[y][x] = 100 - w;
        }
    }

    const sorted = sortedEnemies(data);
    if (!sorted.length) {
        return;
    }
    for (const closest of sorted) {
        const pfGrid = new PF.Grid(data.board.width, data.board.height, matrix, costs);

        let aheadX = null;
        let aheadY = null;
        if (closest.snake.body[0].x < closest.snake.body[1].x) {
            aheadX = closest.snake.body[0].x - 2;
            aheadY = closest.snake.body[0].y;
        } else if (closest.snake.body[0].x > closest.snake.body[1].x) {
            aheadX = closest.snake.body[0].x + 2;
            aheadY = closest.snake.body[0].y;
        } else if (closest.snake.body[0].y < closest.snake.body[1].y) {
            aheadX = closest.snake.body[0].x;
            aheadY = closest.snake.body[0].y - 2;
        } else if (closest.snake.body[0].y > closest.snake.body[1].y) {
            aheadX = closest.snake.body[0].x;
            aheadY = closest.snake.body[0].y + 2;
        }
        log('ahead', aheadX, aheadY);
        if (aheadX < 0 || aheadX >= data.board.width || aheadY < 0 || aheadY >= data.board.height) {
            continue;
        }

        const path = pf.findPath(data.you.body[0].x, data.you.body[0].y, aheadX, aheadY, pfGrid.clone());

        for (let i = 0; i < path.length; i++) {
            const p = path[i];
            if (i === 0) {
                continue;
            }
            if (p[0] == data.you.body[0].x - 1 && p[1] == data.you.body[0].y) {
                log('moveTowardsEnemy', p, 'left');
                return LEFT;
            } else if (p[0] == data.you.body[0].x + 1 && p[1] == data.you.body[0].y) {
                log('moveTowardsEnemy', p, 'right');
                return RIGHT;
            } else if (p[0] == data.you.body[0].x && p[1] == data.you.body[0].y - 1) {
                log('moveTowardsEnemy', p, 'up');
                return UP;
            } else if (p[0] == data.you.body[0].x && p[1] == data.you.body[0].y + 1) {
                log('moveTowardsEnemy', p, 'down');
                return DOWN;
            } else {
                log('moveTowardsEnemy', p, 'no path');
            }
        }
    }
    log('moveTowardsEnemy', 'no options');
}
