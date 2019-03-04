import { BTData } from '../../types/BTData';
import { Color } from '../../types/Color';
import { HeadType } from '../../types/HeadType';
import { TailType } from '../../types/TailType';
import { moveTowardsFoodPf } from '../../lib/moveTowardsFoodPf';
import { moveTowardsEnemy } from '../../lib/moveTowardsEnemy';
import { randomMove } from '../../lib/randomMove';
import { smartRandomMove } from '../../lib/smartRandomMove';

export class Tak {
    start(data: BTData) {
        return {
            color: Color.RED,
            headType: HeadType.FANG,
            tailType: TailType.FRECKLED,
        };
    }
    move(data: BTData) {
        let direction;
        if (data.you.health < 30) {
            direction = moveTowardsFoodPf(data);
        }
        if (!direction) {
            direction = moveTowardsEnemy(data);
        }
        if (!direction) {
            direction = moveTowardsFoodPf(data);
        }
        if (!direction) {
            direction = smartRandomMove(data);
        }
        if (!direction) {
            direction = randomMove(data);
        }
        return {
            move: direction,
        };
    }
}
