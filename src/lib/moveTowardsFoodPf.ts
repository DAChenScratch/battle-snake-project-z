import { log } from './log';
import { weight, BLOCKED_THRESHOLD } from './weight';
import { BTData } from '../types/BTData';
import { sortedFood } from './sortedFood';
import { MoveDirection } from '../types/MoveDirection';

const PF = require('pathfinding');

const pf = new PF.AStarFinder({
    allowDiagonal: false,
    useCost: true,
});

const BLOCKED = 1;
const FREE = 0;

export function moveTowardsFoodPf(data: BTData) {
    const matrix = [];
    const costs = [];
    for (var y = 0; y < data.board.height; y++) {
        matrix[y] = [];
        costs[y] = [];
        for (var x = 0; x < data.board.width; x++) {
            const w = weight(data, x, y);
            matrix[y][x] = w > BLOCKED_THRESHOLD ? FREE : BLOCKED;
            costs[y][x] = 100 - w;
        }
    }

    const sorted = sortedFood(data);
    if (!sorted.length) {
        return;
    }
    closest: for (const closest of sorted) {
        const pfGrid = new PF.Grid(data.board.width, data.board.height, matrix, costs);
        const path = pf.findPath(data.you.body[0].x, data.you.body[0].y, closest.food.x, closest.food.y, pfGrid.clone());

        for (let i = 0; i < path.length; i++) {
            const p = path[i];
            if (i === 0) {
                continue;
            }
            if (p[0] == data.you.body[0].x - 1 && p[1] == data.you.body[0].y) {
                log('moveTowardsFoodPf', p, 'left');
                return MoveDirection.LEFT;
            } else if (p[0] == data.you.body[0].x + 1 && p[1] == data.you.body[0].y) {
                log('moveTowardsFoodPf', p, 'right');
                return MoveDirection.RIGHT;
            } else if (p[0] == data.you.body[0].x && p[1] == data.you.body[0].y - 1) {
                log('moveTowardsFoodPf', p, 'up');
                return MoveDirection.UP;
            } else if (p[0] == data.you.body[0].x && p[1] == data.you.body[0].y + 1) {
                log('moveTowardsFoodPf', p, 'down');
                return MoveDirection.DOWN;
            } else {
                log('moveTowardsFoodPf', p, 'no path');
            }
        }
    }
    log('moveTowardsFoodPf', 'no options');
}
