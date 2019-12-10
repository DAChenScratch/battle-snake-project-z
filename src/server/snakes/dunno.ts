import { BTData } from '../../types/BTData';
import { Color } from '../../types/Color';
import { HeadType } from '../../types/HeadType';
import { TailType } from '../../types/TailType';
import { moveTowardsFoodPf } from '../../lib/moveTowardsFoodPf';
import { randomMove } from '../../lib/randomMove';
import { smartRandomMove } from '../../lib/smartRandomMove';
import { moveAway } from '../../lib/moveAway';
import { BaseSnake } from './base-snake';

export class Dunno extends BaseSnake {
    start(data: BTData) {
        return {
            color: Color.GREY,
            headType: HeadType.SAND_WORM,
            tailType: TailType.ROUND_BUM,
        };
    }

    move(data: BTData) {
        let direction;
        direction = moveTowardsFoodPf(data);
        if (!direction) {
            direction = moveAway(data);
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
