import { BTRequest } from '../../types/BTData';
import { Color } from '../../types/Color';
import { HeadType } from '../../types/HeadType';
import { TailType } from '../../types/TailType';
import { moveTowardsFoodPf } from '../../lib/moveTowardsFoodPf';
import { moveTowardsEnemy } from '../../lib/moveTowardsEnemy';
import { randomMove } from '../../lib/randomMove';
import { smartRandomMove } from '../../lib/smartRandomMove';
import { BaseSnake, StateFunction } from './base-snake';
import { ISnake } from './snake-interface';
import { ServerMoveResponse } from '../Server';
import { MoveDirection } from '../../types/MoveDirection';

export class Rando extends BaseSnake implements ISnake {
    public port: number = 9003;

    public color = Color.CARROT;
    public headType = HeadType.REGULAR;
    public tailType = TailType.FAT_RATTLE;

    protected states: StateFunction[] = [
        this.getFood,
        smartRandomMove,
        randomMove,
    ];

    private getFood(request: BTRequest): MoveDirection {
        // @todo try different numbers for this
        if (request.body.you.health < 20) {
            return moveTowardsFoodPf(request, {
                blockHeads: true,
                attackHeads: true,
            }, true);
        }
    }
}
