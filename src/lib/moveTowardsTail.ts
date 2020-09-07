import { log } from './log';
import { BTData, BTRequest } from '../types/BTData';
import { pathTo } from './Pather';
import { WeightOptions } from './weight';

// @todo don't move if near bigger snake
export function moveTowardsTail(request: BTRequest, weightOptions: WeightOptions) {
    const path = pathTo(request, request.body.you, request.body.you.body[request.body.you.body.length - 1].x, request.body.you.body[request.body.you.body.length - 1].y, weightOptions);
    if (path) {
        request.log('moveTowardsTail', path.direction);
        return path.direction;
    }
    request.log('moveTowardsTail', 'no options');
}
