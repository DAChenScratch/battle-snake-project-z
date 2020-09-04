import { BTRequest } from '../../types/BTData';
import { Color } from '../../types/Color';
import { HeadType } from '../../types/HeadType';
import { TailType } from '../../types/TailType';
import { moveTowardsFoodPf } from '../../lib/moveTowardsFoodPf';
import { randomMove } from '../../lib/randomMove';
import { smartRandomMove } from '../../lib/smartRandomMove';
import { moveTowardsTail } from '../../lib/moveTowardsTail';
import { moveAway } from '../../lib/moveAway';
import { BaseSnake, StateFunction } from './base-snake';
import { ISnake } from './snake-interface';
import { closestEnemyHead } from '../../lib/closestEnemyHead';
import { MoveDirection } from '../../types/MoveDirection';

export class TailChase extends BaseSnake implements ISnake {
    public port: number = 9005;

    public color = Color.GREEN;
    public headType = HeadType.PIXEL;
    public tailType = TailType.HOOK;

    protected states: StateFunction[] = [
        this.getFood,
        this.runAwayRandom,
        this.chaseTail,
        smartRandomMove,
        randomMove,
    ];

    private getFood(request: BTRequest): MoveDirection {
        if (request.body.you.health < request.body.board.width || request.body.you.health < request.body.board.height) {
            return moveTowardsFoodPf(request);
        }
    }

    private chaseTail(request: BTRequest): MoveDirection {
        return moveTowardsTail(request, {
            blockHeads: true,
            attackHeads: false,
        });
    }

    private runAwayRandom(request: BTRequest): MoveDirection {
        const closest = closestEnemyHead(request);
        if (closest && closest.path.length <= 4) {
            return smartRandomMove(request, {
                blockHeads: true,
                attackHeads: false,
            });
        }
    }

    private runAway(request: BTRequest): MoveDirection {
        const closest = closestEnemyHead(request);
        if (closest && closest.path.length <= 4) {
            return moveAway(request);
        }
    }
}
