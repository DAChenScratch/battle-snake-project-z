import { BTData } from '../../types/BTData';
import { Color } from '../../types/Color';
import { HeadType } from '../../types/HeadType';
import { TailType } from '../../types/TailType';
import { moveTowardsFoodPf } from '../../lib/moveTowardsFoodPf';
import { moveTowardsEnemy } from '../../lib/moveTowardsEnemy';
import { randomMove } from '../../lib/randomMove';
import { smartRandomMove } from '../../lib/smartRandomMove';

export class Rando {
    start(data: BTData) {
        return {
            color: Color.CARROT,
            headType: HeadType.EVIL,
            tailType: TailType.FAT_RATTLE,
        };
    }
    move(data: BTData) {
        let direction;
        if (data.you.health < 20) {
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
