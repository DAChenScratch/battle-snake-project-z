import { BTData } from '../../types/BTData';
import { Color } from '../../types/Color';
import { HeadType } from '../../types/HeadType';
import { TailType } from '../../types/TailType';
import { moveTowardsFoodPf } from '../../lib/moveTowardsFoodPf';
import { moveTowardsEnemy } from '../../lib/moveTowardsEnemy';
import { smartRandomMove } from '../../lib/smartRandomMove';
import { randomMove } from '../../lib/randomMove';
import { moveAway } from '../../lib/moveAway';
import { moveTowardsTail } from '../../lib/moveTowardsTail';
import { Server } from '../Server';
import { WebSocketServer } from '../WebSocketServer';

export class WorkItOut {
    private opsCount: number;
    public ops: any[];
    public info: any;

    constructor() {
    }

    start(data: BTData) {
        const options = [
            moveAway,
            moveTowardsEnemy,
            moveTowardsFoodPf,
            moveTowardsTail,
            randomMove,
            smartRandomMove,
        ];
        this.opsCount = Math.ceil(Math.random() * options.length);
        this.ops = [];
        while (this.ops.length < this.opsCount) {
            this.ops.push(options[Math.floor(Math.random() * options.length)]);
        }
        this.ops = this.ops.filter((v, i, a) => a.indexOf(v) === i);

        this.info = {
            name: this.constructor.name,
            ops: this.ops.map(op => op.name),
        };
        return {
            color: Color.BROWN,
            headType: HeadType.SAND_WORM,
            tailType: TailType.SHARP,
        };
    }

    move(data: BTData) {
        let direction;
        for (const op of this.ops) {
            direction = op(data);
            if (direction) {
                break;
            }
        }
        return {
            move: direction,
        };
    }
}
