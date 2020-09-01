
import { BTData } from '../../types/BTData';
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

    move(data: BTData) {
        let direction;
        direction = moveTowardsFoodPf(data);
        if (!direction) {
            direction = moveAway(data);
        }
        if (!direction) {
            direction = lookAhead(data);
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
