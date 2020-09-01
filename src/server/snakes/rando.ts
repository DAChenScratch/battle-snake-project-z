import { BTData } from '../../types/BTData';
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
    public headType = HeadType.EVIL;
    public tailType = TailType.FAT_RATTLE;

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
