import { log } from './log';
import { BTData } from '../types/BTData';
import { Pather } from './Pather';

export function moveTowardsTail(data: BTData) {
    const pather = new Pather(data, false);
    const path = pather.pathTo(data.you.body[data.you.body.length - 1].x, data.you.body[data.you.body.length - 1].y);
    if (path.length) {
        const direction = pather.pathToDirection(path);
        if (direction) {
            log('moveTowardsTail', direction);
            return direction;
        }
    }
    log('moveTowardsEnemy', 'no options');
}
