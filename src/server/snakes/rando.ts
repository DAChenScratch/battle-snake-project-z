import { BTRequest } from '../../types/BTData';
import { Color } from '../../types/Color';
import { HeadType } from '../../types/HeadType';
import { TailType } from '../../types/TailType';
import { moveTowardsFoodPf } from '../../lib/moveTowardsFoodPf';
import { moveTowardsEnemy } from '../../lib/moveTowardsEnemy';
import { randomMove } from '../../lib/randomMove';
import { smartRandomMove } from '../../lib/smartRandomMove';
import { BaseSnake } from './base-snake';
import { ISnake } from './snake-interface';
import { ServerMoveResponse } from '../Server';

export class Rando extends BaseSnake implements ISnake {
    public port: number = 9003;

    public color = Color.CARROT;
    public headType = HeadType.REGULAR;
    public tailType = TailType.FAT_RATTLE;

    public move(request: BTRequest): ServerMoveResponse | null {
        let direction;
        if (request.body.you.health < 20) {
            direction = moveTowardsFoodPf(request);
        }
        if (!direction) {
            direction = smartRandomMove(request);
        }
        if (!direction) {
            direction = randomMove(request);
        }
        return {
            move: direction,
        };
    }
}
