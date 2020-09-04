import { log } from './log';
import { BTData, BTRequest } from '../types/BTData';
import { Pather } from './Pather';

// @todo don't move if near bigger snake
export function moveTowardsTail(request: BTRequest) {
    const pather = new Pather(request, true);
    const path = pather.pathTo(request.body.you.body[request.body.you.body.length - 1].x, request.body.you.body[request.body.you.body.length - 1].y);
    if (path.length) {
        const direction = pather.pathToDirection(path);
        if (direction) {
            log('moveTowardsTail', direction);
            return direction;
        }
    }
    log('moveTowardsTail', 'no options');
}
