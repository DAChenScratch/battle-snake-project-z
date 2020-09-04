import { BTRequest } from '../../types/BTData';
import { Color } from '../../types/Color';
import { HeadType } from '../../types/HeadType';
import { TailType } from '../../types/TailType';
import { moveTowardsFoodPf } from '../../lib/moveTowardsFoodPf';
import { moveTowardsEnemy } from '../../lib/moveTowardsEnemy';
import { randomMove } from '../../lib/randomMove';
import { moveAway } from '../../lib/moveAway';
import { smartRandomMove } from '../../lib/smartRandomMove';
import { BaseSnake } from './base-snake';
import { ISnake } from './snake-interface';

export class KeepAway extends BaseSnake implements ISnake {
    public port: number = 9002;

    public color = Color.YELLOW;
    public headType = HeadType.DEAD;
    public tailType = TailType.CURLED;

    move(request: BTRequest) {
        let direction;
        if (request.body.you.health < 10) {
            direction = moveTowardsFoodPf(request);
        }
        if (!direction) {
            direction = moveAway(request);
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
