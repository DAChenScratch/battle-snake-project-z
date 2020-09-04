import { BTRequest } from '../../types/BTData';
import { Color } from '../../types/Color';
import { HeadType } from '../../types/HeadType';
import { TailType } from '../../types/TailType';
import { moveTowardsFoodPf } from '../../lib/moveTowardsFoodPf';
import { moveTowardsEnemy } from '../../lib/moveTowardsEnemy';
import { smartRandomMove } from '../../lib/smartRandomMove';
import { randomMove } from '../../lib/randomMove';
import { moveAway } from '../../lib/moveAway';
import { moveTowardsTail } from '../../lib/moveTowardsTail';
import { Server, ServerMoveResponse } from '../Server';
import { WebSocketServer } from '../WebSocketServer';
import { BaseSnake } from './base-snake';
import { ISnake } from './snake-interface';

export class WorkItOut extends BaseSnake implements ISnake {
    public port: number = 9008;

    public color = Color.BROWN;
    public headType = HeadType.SMILE;
    public tailType = TailType.SHARP;

    private opsCount: number;
    public ops: any[];

    // move(request: BTRequest) {
    //     const options = [
    //         moveAway,
    //         moveTowardsEnemy,
    //         moveTowardsFoodPf,
    //         moveTowardsTail,
    //         randomMove,
    //         smartRandomMove,
    //     ];
    //     this.opsCount = Math.ceil(Math.random() * options.length);
    //     this.ops = [];
    //     while (this.ops.length < this.opsCount) {
    //         this.ops.push(options[Math.floor(Math.random() * options.length)]);
    //     }
    //     this.ops = this.ops.filter((v, i, a) => a.indexOf(v) === i);

    //     this.info = {
    //         name: this.constructor.name,
    //         ops: this.ops.map(op => op.name),
    //     };
    // }

    // public move(request: BTRequest): ServerMoveResponse | null {
    //     let direction;
    //     for (const op of this.ops) {
    //         direction = op(request);
    //         if (direction) {
    //             break;
    //         }
    //     }
    //     return {
    //         move: direction,
    //     };
    // }
}
