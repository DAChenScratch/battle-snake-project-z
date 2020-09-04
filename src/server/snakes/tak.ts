import { BTRequest } from '../../types/BTData';
import { Color } from '../../types/Color';
import { HeadType } from '../../types/HeadType';
import { TailType } from '../../types/TailType';
import { moveTowardsFoodPf } from '../../lib/moveTowardsFoodPf';
import { moveTowardsEnemy } from '../../lib/moveTowardsEnemy';
import { randomMove } from '../../lib/randomMove';
import { smartRandomMove } from '../../lib/smartRandomMove';
import { BaseSnake } from './base-snake';
import { ISnake } from './snake-interface';
import { isEnemy } from '../../lib/isEnemy';

export class Tak extends BaseSnake implements ISnake {
    public port: number = 9004;

    public color = Color.RED;
    public headType = HeadType.FANG;
    public tailType = TailType.FRECKLED;

    move(request: BTRequest) {
        let direction;
        let biggestSnake = 0;
        for (const snake of request.body.board.snakes) {
            if (!isEnemy(request.body.you, snake)) {
                continue;
            }
            if (snake.body.length > biggestSnake) {
                biggestSnake = snake.body.length;
            }
        }
        // @todo allow crossing squad (not self)
        // @todo make ai to move to biggest free space
        if (request.body.you.health < 15 || request.body.you.body.length < biggestSnake) {
            direction = moveTowardsFoodPf(request);
        }
        if (!direction) {
            direction = moveTowardsEnemy(request);
        }
        if (!direction) {
            direction = moveTowardsFoodPf(request);
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
