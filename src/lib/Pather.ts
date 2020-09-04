import { weight, BLOCKED_THRESHOLD, WeightOptions } from './weight';
import { BTData, BTXY, BTRequest } from '../types/BTData';
import { MoveDirection } from '../types/MoveDirection';

const PF = require('pathfinding');

const pf = new PF.AStarFinder({
    allowDiagonal: false,
    useCost: true,
});

const BLOCKED = 1;
const FREE = 0;

export interface Path extends Array<[number, number]> {

}

export class Pather {
    private pfGrid;

    constructor(
        private request: BTRequest,
        private weightOptions: WeightOptions,
    ) {
        const matrix = [];
        const costs = [];
        for (var y = 0; y < request.body.board.height; y++) {
            matrix[y] = [];
            costs[y] = [];
            for (var x = 0; x < request.body.board.width; x++) {
                const w = weight(request, x, y, weightOptions);
                matrix[y][x] = w > BLOCKED_THRESHOLD ? FREE : BLOCKED;
                costs[y][x] = 100 - w;
            }
        }
        this.pfGrid = new PF.Grid(request.body.board.width, request.body.board.height, matrix, costs);
    }

    pathTo(x: number, y: number): Path {
        return pf.findPath(this.request.body.you.body[0].x, this.request.body.you.body[0].y, x, y, this.pfGrid.clone());
    }

    pathToDirection(path) {
        for (let i = 0; i < path.length; i++) {
            const point = path[i];
            if (i === 0) {
                continue;
            }
            if (point[0] == this.request.body.you.body[0].x - 1 && point[1] == this.request.body.you.body[0].y) {
                return MoveDirection.LEFT;
            } else if (point[0] == this.request.body.you.body[0].x + 1 && point[1] == this.request.body.you.body[0].y) {
                return MoveDirection.RIGHT;
            } else if (point[0] == this.request.body.you.body[0].x && point[1] == this.request.body.you.body[0].y - 1) {
                return MoveDirection.UP;
            } else if (point[0] == this.request.body.you.body[0].x && point[1] == this.request.body.you.body[0].y + 1) {
                return MoveDirection.DOWN;
            }
            break;
        }
    }

    pathDirection(x: number, y: number) {
        const path = this.pathTo(x, y);
        return this.pathToDirection(path);
    }
}
