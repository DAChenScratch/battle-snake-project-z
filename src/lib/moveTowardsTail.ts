import { log } from './log';
import { BTData, BTRequest } from '../types/BTData';
import { Pather } from './Pather';
import { WeightOptions } from './weight';

// @todo don't move if near bigger snake
export function moveTowardsTail(request: BTRequest, weightOptions: WeightOptions) {
    const pather = new Pather(request, weightOptions);
    const path = pather.pathTo(request.body.you.body[request.body.you.body.length - 1].x, request.body.you.body[request.body.you.body.length - 1].y);
    if (path.length) {
        const direction = pather.pathToDirection(path);
        if (direction) {
            request.log('moveTowardsTail', direction);
            return direction;
        }
    }
    request.log('moveTowardsTail', 'no options');
}
