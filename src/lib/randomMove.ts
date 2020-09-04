import { isFree } from './isFree';
import { log } from './log';
import { BTData, BTRequest } from '../types/BTData';
import { MoveDirection } from '../types/MoveDirection';
import { shuffle } from './shuffle';

export function randomMove(request: BTRequest) {
    let direction, x, y;
    const directions = [MoveDirection.LEFT, MoveDirection.RIGHT, MoveDirection.UP, MoveDirection.DOWN];
    shuffle(directions);
    while (direction = directions.pop()) {
        switch (direction) {
            case MoveDirection.UP:
                x = request.body.you.body[0].x;
                y = request.body.you.body[0].y - 1;
                break;

            case MoveDirection.DOWN:
                x = request.body.you.body[0].x;
                y = request.body.you.body[0].y + 1;
                break;

            case MoveDirection.LEFT:
                x = request.body.you.body[0].x - 1;
                y = request.body.you.body[0].y;
                break;

            case MoveDirection.RIGHT:
                x = request.body.you.body[0].x + 1;
                y = request.body.you.body[0].y;
                break;
        }
        if (isFree(request.body, x, y)) {
            log('randomMove', direction);
            return direction;
        }
    }
    log('randomMove', 'no-options');
}
