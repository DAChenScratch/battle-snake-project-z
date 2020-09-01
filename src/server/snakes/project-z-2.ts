import { BTData } from '../../types/BTData';
import { Color } from '../../types/Color';
import { HeadType } from '../../types/HeadType';
import { TailType } from '../../types/TailType';
import { moveTowardsFoodPf } from '../../lib/moveTowardsFoodPf';
import { moveTowardsEnemy } from '../../lib/moveTowardsEnemy';
import { randomMove } from '../../lib/randomMove';
import { smartRandomMove } from '../../lib/smartRandomMove';
import { moveAway } from '../../lib/moveAway';
import { BaseSnake } from './base-snake';
import { moveTowardsTail } from '../../lib/moveTowardsTail';
import { moveTowardsKill } from '../../lib/moveTowardsKill';
import { ISnake } from './snake-interface';

export class ProjectZ2 extends BaseSnake implements ISnake {
    public port: number = 9009;

    public color = Color.GREY;
    public headType = HeadType.SAND_WORM;
    public tailType = TailType.ROUND_BUM;

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
