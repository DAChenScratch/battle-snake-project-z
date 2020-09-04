import { BTRequest } from '../../types/BTData';
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

    move(request: BTRequest) {
        let direction;
        if (request.body.you.health < request.body.board.width || request.body.you.health < request.body.board.height) {
            direction = moveTowardsFoodPf(request);
        }

        const closest = closestEnemyHead(request);
        if (closest && closest.path.length <= 4) {
            direction = moveAway(request);
        }
        if (!direction) {
            direction = moveTowardsTail(request);
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
