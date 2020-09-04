import { BTRequest } from '../../types/BTData';
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

    move(request: BTRequest) {
        let direction;
        // Only go for food if smaller than other snake -2
        direction = moveTowardsFoodPf(request);
        if (!direction) {
            direction = moveAway(request);
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
