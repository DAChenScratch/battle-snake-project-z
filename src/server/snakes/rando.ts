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

export class Rando extends BaseSnake implements ISnake {
    public port: number = 9003;

    public color = Color.CARROT;
    public headType = HeadType.REGULAR;
    public tailType = TailType.FAT_RATTLE;

    move(request: BTRequest) {
        let direction;
        if (request.body.you.health < 20) {
            direction = moveTowardsFoodPf(request);
        }
        if (!direction) {
            direction = smartRandomMove(request);
        }
        if (!direction) {
            direction = randomMove(request.body);
        }
        return {
            move: direction,
        };
    }
}
