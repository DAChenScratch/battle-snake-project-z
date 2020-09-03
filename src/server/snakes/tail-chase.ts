import { BTData } from '../../types/BTData';
import { Color } from '../../types/Color';
import { HeadType } from '../../types/HeadType';
import { TailType } from '../../types/TailType';
import { moveTowardsFoodPf } from '../../lib/moveTowardsFoodPf';
import { moveTowardsEnemy } from '../../lib/moveTowardsEnemy';
import { randomMove } from '../../lib/randomMove';
import { smartRandomMove } from '../../lib/smartRandomMove';
import { moveTowardsTail } from '../../lib/moveTowardsTail';
import { moveAway } from '../../lib/moveAway';
import { BaseSnake } from './base-snake';
import { ISnake } from './snake-interface';
import { closestEnemyHead } from '../../lib/closestEnemyHead';

export class TailChase extends BaseSnake implements ISnake {
    public port: number = 9005;

    public color = Color.GREEN;
    public headType = HeadType.PIXEL;
    public tailType = TailType.HOOK;

    move(data: BTData) {
        let direction;
        if (data.you.health < data.board.width || data.you.health < data.board.height) {
            direction = moveTowardsFoodPf(data);
        }

        const closest = closestEnemyHead(data);
        console.log(closest);
        if (closest && closest.path.length <= 4) {
            direction = moveAway(data);
        }
        if (!direction) {
            direction = moveTowardsTail(data);
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
