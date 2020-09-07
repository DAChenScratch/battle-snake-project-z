import { weight, BLOCKED_THRESHOLD, WeightOptions } from './weight';
import { BTRequest, BTSnake } from '../types/BTData';
import { MoveDirection } from '../types/MoveDirection';

const PF = require('pathfinding');

const pf = new PF.AStarFinder({
    allowDiagonal: false,
    useCost: true,
});

const BLOCKED = 1;
const FREE = 0;

export interface Path {
    path: Array<[number, number]>,
    distance: number,
    direction: MoveDirection,
}

export function pathTo(request: BTRequest, snake: BTSnake, x: number, y: number, weightOptions: WeightOptions): Path | null {
    const matrix = [];
    const costs = [];
    for (let y = 0; y < request.body.board.height; y++) {
        matrix[y] = [];
        costs[y] = [];
        for (let x = 0; x < request.body.board.width; x++) {
            const w = weight(request, x, y, weightOptions);
            matrix[y][x] = w > BLOCKED_THRESHOLD ? FREE : BLOCKED;
            costs[y][x] = 100 - w;
        }
    }
    const grid = new PF.Grid(request.body.board.width, request.body.board.height, matrix, costs);
    const path: Array<[number, number]> = pf.findPath(snake.body[0].x, snake.body[0].y, x, y, grid);
    if (!path || !path.length) {
        return null;
    }
    const direction = pathToDirection(path, snake);
    if (!direction) {
        return null;
    }
    return {
        path,
        direction,
        distance: path.length,
    }
}

function pathToDirection(path: Array<[number, number]>, snake: BTSnake): MoveDirection | null {
    for (let i = 0; i < path.length; i++) {
        const point = path[i];
        if (i === 0) {
            continue;
        }
        if (point[0] == snake.body[0].x - 1 && point[1] == snake.body[0].y) {
            return MoveDirection.LEFT;
        } else if (point[0] == snake.body[0].x + 1 && point[1] == snake.body[0].y) {
            return MoveDirection.RIGHT;
        } else if (point[0] == snake.body[0].x && point[1] == snake.body[0].y - 1) {
            return MoveDirection.UP;
        } else if (point[0] == snake.body[0].x && point[1] == snake.body[0].y + 1) {
            return MoveDirection.DOWN;
        }
        break;
    }
    return null;
}
