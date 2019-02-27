import { isFree } from './isFree';
import { log } from './log';
import { BTData } from '../types/BTData';

export function randomMove(data: BTData) {
    let direction, x, y;
    let loopBreak = 100;
    do {
        direction = Math.floor(Math.random() * 4);
        switch (direction) {
            // Up
            case 0:
                x = data.you.body[0].x;
                y = data.you.body[0].y - 1;
                break;

            // Down
            case 1:
                x = data.you.body[0].x;
                y = data.you.body[0].y + 1;
                break;

            // Left
            case 2:
                x = data.you.body[0].x - 1;
                y = data.you.body[0].y;
                break;

            // Right
            case 3:
                x = data.you.body[0].x + 1;
                y = data.you.body[0].y;
                break;
        }
        if (loopBreak-- <= 0) {
            log('randomMove', 'loopBreak');
            break;
        }
    } while (!isFree(data, x, y));
    log('randomMove', direction);
    return direction;
}
