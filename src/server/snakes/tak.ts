import { BTData } from '../../types/BTData';
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

    move(data: BTData) {
        let direction;
        let biggestSnake = 0;
        for (const snake of data.board.snakes) {
            if (!isEnemy(data.you, snake)) {
                continue;
            }
            if (snake.body.length > biggestSnake) {
                biggestSnake = snake.body.length;
            }
        }
        if (data.you.health < 15 || data.you.body.length < biggestSnake) {
            direction = moveTowardsFoodPf(data);
        }
        if (!direction) {
            direction = moveTowardsEnemy(data);
        }
        if (!direction) {
            direction = moveTowardsFoodPf(data);
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
