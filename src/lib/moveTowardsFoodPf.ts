import { gridDistance } from './gridDistance';
import { log } from './log';
import { weight } from './weight';
import { closestFood } from './closestFood';
import { BTData } from '../types/BTData';

const PF = require('pathfinding');

const pf = new PF.AStarFinder({
    allowDiagonal: false,
    useCost: true,
});

const BLOCKED = 1;
const FREE = 0;

export function moveTowardsFoodPf(data: BTData) {
    const closest = closestFood(data);
    if (!closest) {
        log('moveTowardsFoodPf', 'no food');
        return;
    }

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

    const pfGrid = new PF.Grid(data.board.width, data.board.height, matrix, costs);
    const path = pf.findPath(data.you.body[0].x, data.you.body[0].y, closest.food.x, closest.food.y, pfGrid.clone());

    for (const [i, p] of path.entries()) {
        if (i == 0) {
            continue;
        }
        if (p[0] == data.you.body[0].x - 1) {
            // Left
            log('moveTowardsFoodPf', p, 'left');
            return 2;
        } else if (p[0] == data.you.body[0].x + 1) {
            // Right
            log('moveTowardsFoodPf', p, 'right');
            return 3;
        } else if (p[1] == data.you.body[0].y - 1) {
            // Up
            log('moveTowardsFoodPf', p, 'up');
            return 0;
        } else if (p[1] == data.you.body[0].y + 1) {
            // Down
            log('moveTowardsFoodPf', p, 'down');
            return 1;
        }
        break;
    }
    log('moveTowardsFoodPf', 'no options');
}
