import { log } from './log';
import { BTRequest } from '../types/BTData';
import { sortedFood } from './sortedFood';
import { Pather } from './Pather';
import { weight } from './weight';

export function moveTowardsFoodPf(request: BTRequest) {
    let pather = new Pather(request, {
        blockHeads: true,
        attackHeads: true,
    });

    const sorted = sortedFood(request.body);
    if (!sorted.length) {
        log('moveTowardsFoodPf', 'no food');
        return;
    }
    for (const closest of sorted) {
        const direction = pather.pathDirection(closest.food.x, closest.food.y);
        const w = weight(request, closest.food.x, closest.food.y, {
            blockHeads: true,
            attackHeads: true,
        });
        if (direction && w > 20) {
            log('moveTowardsFoodPf', direction, closest);
            return direction;
        }
    }
    log('moveTowardsFoodPf', 'no options');
}
