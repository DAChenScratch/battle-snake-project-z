import { BTData } from '../../types/BTData';
import { Color } from '../../types/Color';
import { HeadType } from '../../types/HeadType';
import { TailType } from '../../types/TailType';
import { moveTowardsFoodPf } from '../../lib/moveTowardsFoodPf';
import { moveTowardsEnemy } from '../../lib/moveTowardsEnemy';
import { randomMove } from '../../lib/randomMove';

export class ProjectZ {
    start(data: BTData) {
        return {
            color: Color.PINK,
            headType: HeadType.BELUGA,
            tailType: TailType.BLOCK_BUM,
        };
    }
    move(data: BTData) {
        let direction;
        direction = moveTowardsFoodPf(data);
        if (!direction) {
            direction = moveTowardsEnemy(data);
        }
        if (!direction) {
            direction = randomMove(data);
        }
        return {
            move: direction,
        };
    }
}
