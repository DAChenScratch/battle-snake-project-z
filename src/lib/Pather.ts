import { weight, BLOCKED_THRESHOLD } from './weight';
import { BTData } from '../types/BTData';
import { MoveDirection } from '../types/MoveDirection';

const PF = require('pathfinding');

const pf = new PF.AStarFinder({
    allowDiagonal: false,
    useCost: true,
});

const BLOCKED = 1;
const FREE = 0;

export class Pather {
    private pfGrid;

    constructor(
        private data: BTData,
        private blockHeads = true,
    ) {
        const matrix = [];
        const costs = [];
        for (var y = 0; y < data.board.height; y++) {
            matrix[y] = [];
            costs[y] = [];
            for (var x = 0; x < data.board.width; x++) {
                const w = weight(data, x, y, blockHeads);
                matrix[y][x] = w > BLOCKED_THRESHOLD ? FREE : BLOCKED;
                costs[y][x] = 100 - w;
            }
        }
        this.pfGrid = new PF.Grid(data.board.width, data.board.height, matrix, costs);
    }

    pathTo(x: number, y: number) {
        return pf.findPath(this.data.you.body[0].x, this.data.you.body[0].y, x, y, this.pfGrid.clone());
    }

    pathToDirection(path) {
        for (let i = 0; i < path.length; i++) {
            const point = path[i];
            if (i === 0) {
                continue;
            }
            if (point[0] == this.data.you.body[0].x - 1 && point[1] == this.data.you.body[0].y) {
                return MoveDirection.LEFT;
            } else if (point[0] == this.data.you.body[0].x + 1 && point[1] == this.data.you.body[0].y) {
                return MoveDirection.RIGHT;
            } else if (point[0] == this.data.you.body[0].x && point[1] == this.data.you.body[0].y - 1) {
                return MoveDirection.DOWN;
            } else if (point[0] == this.data.you.body[0].x && point[1] == this.data.you.body[0].y + 1) {
                return MoveDirection.UP;
            }
            break;
        }
    }

    pathDirection(x: number, y: number) {
        const path = this.pathTo(x, y);
        return this.pathToDirection(path);
    }
}
