
import { BTRequest } from '../../types/BTData';
import { Color } from '../../types/Color';
import { HeadType } from '../../types/HeadType';
import { TailType } from '../../types/TailType';
import { moveTowardsFoodPf } from '../../lib/moveTowardsFoodPf';
import { randomMove } from '../../lib/randomMove';
import { smartRandomMove } from '../../lib/smartRandomMove';
import { moveAway } from '../../lib/moveAway';
import { BaseSnake } from './base-snake';
import { moveTowardsKill } from '../../lib/moveTowardsKill';
import { lookAhead } from '../../lib/lookAhead';
import { ISnake } from './snake-interface';

export class Dunno extends BaseSnake implements ISnake {
    public port: number = 9007;
    public color = Color.NEPHRITIS;
    public headType = HeadType.SAND_WORM;
    public tailType = TailType.PIXEL;

    move(request: BTRequest) {
        let direction;
        direction = moveTowardsFoodPf(request);
        if (!direction) {
            direction = moveAway(request);
        }
        if (!direction) {
            direction = lookAhead(request.body);
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
