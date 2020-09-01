import { BTData } from '../../types/BTData';
import { Color } from '../../types/Color';
import { HeadType } from '../../types/HeadType';
import { TailType } from '../../types/TailType';
import { moveTowardsFoodPf } from '../../lib/moveTowardsFoodPf';
import { randomMove } from '../../lib/randomMove';
import { smartRandomMove } from '../../lib/smartRandomMove';
import { moveAway } from '../../lib/moveAway';
import { BaseSnake } from './base-snake';
import { ISnake } from './snake-interface';

export class ProjectZ extends BaseSnake implements ISnake {
    public port: number = 9001;

    public color = Color.PINK;
    public headType = HeadType.BELUGA;
    public tailType = TailType.BLOCK_BUM;

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
