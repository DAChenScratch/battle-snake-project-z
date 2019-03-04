import { BTData } from '../../types/BTData';
import { Color } from '../../types/Color';
import { HeadType } from '../../types/HeadType';
import { TailType } from '../../types/TailType';
import { moveTowardsFoodPf } from '../../lib/moveTowardsFoodPf';
import { moveTowardsEnemy } from '../../lib/moveTowardsEnemy';
import { randomMove } from '../../lib/randomMove';
import { moveAway } from '../../lib/moveAway';

export class KeepAway {
    start(data: BTData) {
        return {
            color: Color.YELLOW,
            headType: HeadType.DEAD,
            tailType: TailType.CURLED,
        };
    }
    move(data: BTData) {
        let direction;
        if (data.you.health < 30) {
            direction = moveTowardsFoodPf(data);
        }
        if (!direction) {
            direction = moveAway(data);
        }
        if (!direction) {
            direction = randomMove(data);
        }
        return {
            move: direction,
        };
    }
}
